import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import OpenAI from "openai";
import PromptInput from "./prompt/PromptInput";
import PromptOutput from "./prompt/PromptOutput";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are part of a team of bots that creates videos. You work with an assistant bot that will draw anything you say in square brackets.

For example, outputting "a beautiful morning in the woods with the sun peaking through the trees" will trigger your partner bot to output a video of a forest morning, as described. You will be prompted by people looking to create detailed, amazing videos. The way to accomplish this is to take their short prompts and make them extremely detailed and descriptive.

There are a few rules to follow:
- You will only ever output a single video description per user request.
- When modifications are requested, you should not simply make the description longer. You should refactor the entire description to integrate the suggestions.
- Other times the user will not want modifications, but instead want a new image. In this case, you should ignore your previous conversation with the user.
`;

const PromptImprover = () => {
  const [prompt, setPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const improvePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "The prompt field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Create an imaginative video descriptive caption or modify an earlier caption in ENGLISH for the user input: "${prompt.trim()}"`,
          },
        ],
        model: "gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 250,
      });

      const improvedText = response.choices[0].message.content;
      setImprovedPrompt(improvedText);
      
      toast({
        title: "Prompt improved!",
        description: "Your prompt has been enhanced with more specific details and clarity.",
      });
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast({
        title: "Error improving prompt",
        description: "Please make sure you have set up your OpenAI API key correctly",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
          AI Prompt Improver
        </h1>
        <p className="text-muted-foreground">
          Enter your prompt below and let AI help you make it better
        </p>
      </div>

      <div className="space-y-4">
        <PromptInput
          prompt={prompt}
          isLoading={isLoading}
          onPromptChange={setPrompt}
          onImprove={improvePrompt}
        />

        {improvedPrompt && <PromptOutput improvedPrompt={improvedPrompt} />}
      </div>
    </div>
  );
};

export default PromptImprover;