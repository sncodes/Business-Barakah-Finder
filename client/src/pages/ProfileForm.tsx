import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { businessProfileInsertSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = businessProfileInsertSchema;

type FormValues = z.infer<typeof formSchema>;

const ProfileForm = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
      industrySector: "",
      teamSize: "",
      fundingStage: "",
      notes: "",
      growthGoals: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await apiRequest("POST", "/.netlify/functions/business-profile", data);
      if (response.ok) {
        // Profile submitted successfully, now fetch the matches
        const matchesResponse = await apiRequest("GET", "/api/match-results");
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          // Navigate to a new page to display the matches
          navigate("/matches", { state: matchesData });
        } else {
          throw new Error("Failed to fetch match results");
        }
      } else {
        throw new Error("Failed to submit profile");
      }
    } catch (error) {
