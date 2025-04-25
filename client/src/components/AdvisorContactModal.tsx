import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdvisorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvisorContactModal = ({ isOpen, onClose }: AdvisorContactModalProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Request Sent",
        description: "An advisor will contact you shortly.",
      });
      
      // Reset form and close modal
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-primary text-white p-4">
          <h3 className="font-raleway font-semibold text-xl">Speak to an Advisor</h3>
          <p className="text-white/80 text-sm mt-1">
            Fill out this form, and we'll connect you with an advisor who specialises in ethical business support.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border-neutral-300"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border-neutral-300"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1">
                Company Name
              </Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full rounded-md border-neutral-300"
                placeholder="Your company name"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                Your Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border-neutral-300 min-h-[100px]"
                placeholder="Please describe your business needs and any specific questions you have"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-neutral-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary-light text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvisorContactModal;