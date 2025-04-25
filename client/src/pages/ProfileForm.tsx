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
      const response = await apiRequest("POST", "/api/business-profile", data);
      if (response.ok) {
        navigate("/processing");
      } else {
        throw new Error("Failed to submit profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    navigate("/");
  };

  // Define available growth goals
  const growthGoalOptions = [
    { id: "funding", label: "Secure funding or investment" },
    { id: "expansion", label: "Expand to new markets or locations" },
    { id: "products", label: "Develop new products or services" },
    { id: "advisory", label: "Get business advisory or mentorship" },
    { id: "networking", label: "Build business networks or partnerships" },
    { id: "digital", label: "Digital transformation or tech adoption" },
  ];

  return (
    <section className="bg-slate-800 rounded-lg shadow-md p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-raleway font-semibold text-white mb-6">Tell Us About Your Business</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Business Type */}
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Business Type <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="startup">Startup (Less than 3 years old)</SelectItem>
                        <SelectItem value="scale-up">Scale-up (Growing business)</SelectItem>
                        <SelectItem value="established">Established business (5+ years)</SelectItem>
                        <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                        <SelectItem value="family-business">Family Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-300">
                      This helps us understand your stage and structure
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Industry Sector */}
              <FormField
                control={form.control}
                name="industrySector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Industry Sector <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tech">Technology & Software</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="retail">Retail & E-commerce</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="healthcare">Healthcare & Wellness</SelectItem>
                        <SelectItem value="education">Education & Training</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="professional">Professional Services</SelectItem>
                        <SelectItem value="creative">Creative Industries</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Team Size */}
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Team Size <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">Solo Entrepreneur</SelectItem>
                        <SelectItem value="micro">2-5 employees</SelectItem>
                        <SelectItem value="small">6-20 employees</SelectItem>
                        <SelectItem value="medium">21-50 employees</SelectItem>
                        <SelectItem value="large">51+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              {/* Funding Stage */}
              <FormField
                control={form.control}
                name="fundingStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Funding Stage or Revenue <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your funding stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
                        <SelectItem value="seed">Seed funding / Under £100k annual revenue</SelectItem>
                        <SelectItem value="early">Early stage / £100k-£500k annual revenue</SelectItem>
                        <SelectItem value="growth">Growth stage / £500k-£2M annual revenue</SelectItem>
                        <SelectItem value="established">Established / £2M+ annual revenue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Growth Goals */}
              <FormField
                control={form.control}
                name="growthGoals"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-gray-200">Growth Goals (Select all that apply) <span className="text-red-500">*</span></FormLabel>
                    </div>
                    <div className="space-y-2">
                      {growthGoalOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="growthGoals"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-200">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Any specific challenges or requirements? (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about any specific needs or challenges..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="border-primary text-primary hover:bg-neutral-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Button>
            <Button type="submit">
              Find Matches
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ProfileForm;
