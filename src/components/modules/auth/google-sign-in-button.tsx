"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type GoogleSignInButtonProps = {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
  disabled?: boolean;
};

/**
 * Defer the Google Identity Services iframe until the user asks for it.
 * Rendering <GoogleLogin /> on mount (and again under Strict Mode) is what
 * fires accounts.google.com/gsi/button after logout navigations.
 */
export function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const [showGoogleButton, setShowGoogleButton] = useState(false);

  if (!showGoogleButton) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => setShowGoogleButton(true)}
      >
        Continue with Google
      </Button>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(response) => {
          if (!response.credential) {
            onError?.();
            return;
          }
          onSuccess(response.credential);
        }}
        onError={() => {
          onError?.();
        }}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width={320}
        logo_alignment="left"
      />
    </div>
  );
}
