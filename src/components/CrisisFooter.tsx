import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrisisFooter() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <span className="text-muted-foreground font-medium">Need immediate help?</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href="tel:988" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call 988 Lifeline
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href="sms:741741" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Text HOME to 741741
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
