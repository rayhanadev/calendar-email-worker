import { EmailMessage } from "cloudflare:email";
import Groq from "groq-sdk";
import { createMimeMessage } from "mimetext/browser";
import PostalMime from "postal-mime";

import {
  WORKER_EMAIL,
  RECIPIENT_EMAIL,
  SYSTEM_PROMPT,
  type OutputItem,
} from "./consts";
import { streamToArrayBuffer, formatEvent } from "./utils";

export default {
  async email(message, env) {
    const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);

    const parser = new PostalMime();
    const parsedEmail = await parser.parse(rawEmail);
    if (!parsedEmail.text) {
      console.error("Email has no text!");
      return;
    }

    console.log("Text version of Email: ", parsedEmail.text);

    const groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });

    // const response = (await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    //   prompt: generatePrompt(parsedEmail.text),
    // })) as { response?: string };
    // console.log("Response from AI: ", response);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Parse the following email:\n\n${parsedEmail.text}`,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });
    console.log("Response from GROQ: ", response);

    if (!response.choices[0].message.content) {
      console.error("No response from AI!");
      return;
    }

    const { events } = JSON.parse(response.choices[0].message.content) as {
      events: OutputItem[];
    };

    const msg = createMimeMessage();
    msg.setSender({ name: "Calendar Cow", addr: WORKER_EMAIL });
    msg.setRecipient(RECIPIENT_EMAIL);
    msg.setSubject(
      `Added ${events.length} ${events.length > 1 || events.length === 0 ? "events" : "event"} to your calendar!`,
    );
    msg.addMessage({
      contentType: "text/html",
      data: `<html><body>${events
        .map((item) => formatEvent(item))
        .join("\n\n")}</body></html>`,
    });

    await env.PURDUE_EMAIL.send(
      new EmailMessage(WORKER_EMAIL, RECIPIENT_EMAIL, msg.asRaw()),
    ).catch((error) => {
      console.error("Error sending email:", error);
    });
  },
} satisfies ExportedHandler<Env>;
