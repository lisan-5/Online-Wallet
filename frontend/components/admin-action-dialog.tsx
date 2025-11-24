"use client";

import { useState } from "react";
import {
  HiCheckCircle,
  HiXCircle,
  HiChatBubbleOvalLeft,
} from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
  action: "approve" | "reject";
  isLoading: boolean;
}

export function AdminActionDialog({
  isOpen,
  onClose,
  onConfirm,
  action,
  isLoading,
}: AdminActionDialogProps) {
  const [remark, setRemark] = useState("");

  const handleConfirm = () => {
    onConfirm(remark);
    setRemark("");
  };

  const handleClose = () => {
    setRemark("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {/* colored header strip */}
        <div
          className={`-mx-6 mb-4 rounded-t-lg py-3 px-6 ${
            action === "approve" ? "bg-green-500/10" : "bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-md text-white ${
                action === "approve" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {action === "approve" ? (
                <HiCheckCircle size={20} />
              ) : (
                <HiXCircle size={20} />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {action === "approve" ? "Approve Request" : "Reject Request"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {action === "approve"
                  ? "Add an optional remark for the user. This will be visible after approval."
                  : "Provide a concise reason for rejection so the user can correct and re-submit."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="remark">
            Admin Remark{" "}
            {action === "reject" && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            id="remark"
            placeholder={
              action === "approve"
                ? "Optional note for the user..."
                : "Reason for rejection..."
            }
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={5}
            className="rounded-lg shadow-sm"
          />

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <HiChatBubbleOvalLeft className="opacity-80" />
            <span>Notes are logged with your admin ID for audit purposes.</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (action === "reject" && !remark)}
            variant={action === "approve" ? "default" : "destructive"}
            className="flex items-center gap-2"
          >
            {isLoading
              ? "Processing..."
              : action === "approve"
              ? "Approve"
              : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
