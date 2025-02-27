import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/states/useAuth";

const Settings = () => {
  const { auth, removeCredentials } = useAuth();
  const { name, role, department } = auth as NonNullable<typeof auth>;

  return (
    <div className="flex flex-1 flex-col gap-y-4 p-8">
      <div className="flex flex-col">
        <div className="mb-4 flex flex-col items-center">
          <FaUserAlt size={25} className="text-secondary" />
          <h6 className="mb-1 font-semibold uppercase">PROFILE</h6>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold">{name}</span>
            <span className="text-sm font-light">Profile Name</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[20px] font-semibold">{department.name}</span>
            <span className="text-sm font-light">Department</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold capitalize">{role}</span>
            <span className="text-sm font-light">Access Type</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col items-center">
          <IoSettings size={25} className="text-secondary" />
          <h6 className="mb-1 font-semibold uppercase">SETTINGS</h6>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold">Argo Navis</span>
            <span className="text-sm font-light">System Name</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold">2.0</span>
            <span className="text-sm font-light">System Version</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button type="button" onClick={removeCredentials}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
