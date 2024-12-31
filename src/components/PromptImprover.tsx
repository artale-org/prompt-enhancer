import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import OpenAI from "openai";
import PromptInput from "./prompt/PromptInput";
import PromptOutput from "./prompt/PromptOutput";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const defaultSystemPrompt = (mode: string) => `You are part of a team of bots that creates ${mode}s. You work with an assistant bot that will draw anything you say in square brackets.

For example, outputting "a beautiful morning in the woods with the sun peaking through the trees" will trigger your partner bot to output a ${mode} of a forest morning, as described. You will be prompted by people looking to create detailed, amazing ${mode}s. The way to accomplish this is to take their short prompts and make them extremely detailed and descriptive.

There are a few rules to follow:
- You will only ever output a single ${mode} description per user request.
- When modifications are requested, you should not simply make the description longer. You should refactor the entire description to integrate the suggestions.
- Other times the user will not want modifications, but instead want a new ${mode}. In this case, you should ignore your previous conversation with the user.
`;

const PromptImprover = () => {
  const [prompt, setPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("video");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt(mode));
  const [maxTokens, setMaxTokens] = useState(250);
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
            content: `Create an imaginative ${mode} descriptive caption or modify an earlier caption in ENGLISH for the user input: "${prompt.trim()}"`,
          },
        ],
        model: "gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: maxTokens,
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

  const handleModeChange = (value: string) => {
    if (value) {
      setMode(value);
      setSystemPrompt(defaultSystemPrompt(value));
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
        <div className="flex justify-center pt-4">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            className="border rounded-lg"
          >
            <ToggleGroupItem value="image" aria-label="Toggle image mode">
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </ToggleGroupItem>
            <ToggleGroupItem value="video" aria-label="Toggle video mode">
              <VideoIcon className="h-4 w-4 mr-2" />
              Video
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">System Prompt</label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[200px] resize-none font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Tokens</label>
          <Input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            min={1}
            max={2000}
            className="w-full"
          />
        </div>

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