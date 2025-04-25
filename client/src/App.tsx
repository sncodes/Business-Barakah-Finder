import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProfileForm from "@/pages/ProfileForm";
import ProcessingScreen from "@/pages/ProcessingScreen";
import ResultsPage from "@/pages/ResultsPage";
import Layout from "@/components/Layout";
import MatchesPage from '../MatchesPage'; // ADD THIS LINE

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profile" component={ProfileForm} />
        <Route path="/processing" component={ProcessingScreen} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/matches" component={MatchesPage} /> {/* ADD THIS LINE */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
