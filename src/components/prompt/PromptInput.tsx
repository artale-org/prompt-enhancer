import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onImprove: () => void;
}

const PromptInput = ({ prompt, isLoading, onPromptChange, onImprove }: PromptInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Prompt</label>
      <Textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <Button
        onClick={onImprove}
        className="w-full bg-brand-600 hover:bg-brand-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Improving...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Improve Prompt
          </>
        )}
      </Button>
    </div>
  );
};

export default PromptInput;