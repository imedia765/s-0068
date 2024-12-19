import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormFieldsProps {
  userData: any;
  isLoading: boolean;
}

export const ProfileFormFields = ({ userData, isLoading }: ProfileFormFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={userData?.full_name}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={userData?.email}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone</label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={userData?.phone}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">Address</label>
        <Textarea
          id="address"
          name="address"
          defaultValue={userData?.address}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="town" className="text-sm font-medium">Town</label>
        <Input
          id="town"
          name="town"
          defaultValue={userData?.town}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="postcode" className="text-sm font-medium">Post Code</label>
        <Input
          id="postcode"
          name="postcode"
          defaultValue={userData?.postcode}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dob" className="text-sm font-medium">Date of Birth</label>
        <Input
          id="dob"
          name="dob"
          type="date"
          defaultValue={userData?.date_of_birth}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="text-sm font-medium">Gender</label>
        <Select name="gender" defaultValue={userData?.gender} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="maritalStatus" className="text-sm font-medium">Marital Status</label>
        <Select name="maritalStatus" defaultValue={userData?.marital_status} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select Marital Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};