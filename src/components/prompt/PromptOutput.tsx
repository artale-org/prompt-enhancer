import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PromptOutputProps {
  improvedPrompt: string;
}

const PromptOutput = ({ improvedPrompt }: PromptOutputProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(improvedPrompt);
      toast({
        title: "Copied to clipboard!",
        description: "You can now paste the improved prompt anywhere",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Improved Version</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-100/50 to-brand-200/50 rounded-lg" />
        <Textarea
          value={improvedPrompt}
          readOnly
          className="min-h-[100px] resize-none bg-transparent relative z-10"
        />
      </div>
    </div>
  );
};

export default PromptOutput;