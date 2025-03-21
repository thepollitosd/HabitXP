import { useState } from "react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Copy, Link, CheckCircle } from "lucide-react";
import { toast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function InviteFriend() {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateInviteLink = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc("generate_friend_invite", {
        user_id_param: user.id,
      });

      if (error) throw error;

      const link = `${window.location.origin}/invite/${data}`;
      setInviteLink(link);
    } catch (error) {
      console.error("Error generating invite link:", error);
      toast({
        title: "Error",
        description: "Failed to generate invite link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptInvite = async () => {
    if (!user || !inviteCode.trim()) return;

    setIsAccepting(true);
    try {
      const { data, error } = await supabase.rpc("accept_friend_invite", {
        invite_code_param: inviteCode.trim(),
        user_id_param: user.id,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Friend added successfully!",
        });
        setInviteCode("");
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Invalid or expired invite code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast({
        title: "Error",
        description: "Failed to accept invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Link className="h-4 w-4 mr-2" />
          Invite Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
          <DialogDescription>
            Generate an invite link or enter a code to add a friend.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Generate invite link section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Generate Invite Link</Label>
            {inviteLink ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={generateInviteLink}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Generating...
                  </>
                ) : (
                  "Generate Link"
                )}
              </Button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Enter invite code section */}
          <div className="space-y-3">
            <Label htmlFor="inviteCode" className="text-sm font-medium">
              Enter Invite Code
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1"
              />
              <Button
                onClick={acceptInvite}
                disabled={isAccepting || !inviteCode.trim()}
              >
                {isAccepting ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : (
                  "Accept"
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
