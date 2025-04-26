
import Navbar from "@/components/layout/Navbar";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Register = () => {
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join the cosmos</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
