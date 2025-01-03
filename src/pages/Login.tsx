import LoginForm from '@/components/auth/LoginForm';
import CommitteeUpdate from '@/components/auth/CommitteeUpdate';
import MembershipExpectations from '@/components/auth/MembershipExpectations';
import ImportantInformation from '@/components/auth/ImportantInformation';
import MedicalExaminer from '@/components/auth/MedicalExaminer';
import Bismillah from '@/components/Bismillah';

const Login = () => {
  return (
    <div className="min-h-screen bg-dashboard-dark">
      <Bismillah />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Pakistan Welfare Association</h1>
            <p className="text-dashboard-text text-lg">Welcome to our community platform. Please login with your member number.</p>
          </div>

          <LoginForm />
          <CommitteeUpdate />
          <MembershipExpectations />
          <ImportantInformation />
          <MedicalExaminer />

          <footer className="text-center text-dashboard-muted text-sm py-8">
            <p>© 2024 SmartFIX Tech, Burton Upon Trent. All rights reserved.</p>
            <p className="mt-2">Website created and coded by Zaheer Asghar</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;