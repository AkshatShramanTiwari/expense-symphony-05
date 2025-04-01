
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Share2, Copy, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

const Share = () => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin;
  const shareTitle = "Check out this expense manager app - dbsexpensemanagerproject";
  const shareText = "I've been using this awesome expense manager to track my spending. Check it out!";

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy link');
      }
    );
  };

  // Share via native share API if available
  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      })
        .then(() => toast.success('Shared successfully!'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      toast.error('Web Share API not supported on this browser');
    }
  };

  // Social media share URLs
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const mailShareUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Share with Friends</h1>
        <p className="text-muted-foreground">
          Spread the word about dbsexpensemanagerproject
        </p>
      </div>

      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Share Link</CardTitle>
          <CardDescription>
            Copy the link below to share with friends and colleagues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-grow expense-input"
            />
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="expense-button"
            >
              {copied ? "Copied!" : "Copy"}
              <Copy className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {navigator.share && (
            <Button 
              onClick={nativeShare} 
              className="w-full bg-accent hover:bg-accent/90 expense-button"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Share on Social Media</CardTitle>
          <CardDescription>
            Choose your preferred platform to share
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 expense-button"
              onClick={() => window.open(twitterShareUrl, '_blank')}
            >
              <Twitter className="h-8 w-8 mb-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 expense-button"
              onClick={() => window.open(facebookShareUrl, '_blank')}
            >
              <Facebook className="h-8 w-8 mb-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 expense-button"
              onClick={() => window.open(linkedinShareUrl, '_blank')}
            >
              <Linkedin className="h-8 w-8 mb-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 expense-button"
              onClick={() => window.open(mailShareUrl, '_blank')}
            >
              <Mail className="h-8 w-8 mb-2" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Why Share?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="mt-1 bg-accent/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Help Friends Save Money</h3>
                <p className="text-sm text-muted-foreground">
                  Share this tool with friends to help them track their expenses and save money.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 bg-accent/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Build Financial Awareness</h3>
                <p className="text-sm text-muted-foreground">
                  Promote financial literacy and responsible spending habits.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 bg-accent/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Support Our Development</h3>
                <p className="text-sm text-muted-foreground">
                  Help us grow by spreading the word about dbsexpensemanagerproject.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;
