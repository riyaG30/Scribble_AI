"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function CreateTeam() {
    const [teamName, setTeamName] = useState("");
    const createTeam = useMutation(api.teams.createTeam);
    const { user }: any = useKindeBrowserClient();
    const router = useRouter();
    const createNewTeam = () => {
        createTeam({
            teamName: teamName,
            createdBy: user?.email,
        }).then((resp) => {
            console.log(resp);
            if (resp) {
                router.push("/dashboard");
                toast("Team created successfully!!!");
            }
        });
    };
    return (
        <div className=" px-6 md:px-16 my-16">
          <Image
  src="/logo-1.png"
  alt="Logo"
  width={100} // Set width explicitly
  height={100} // Set height explicitly
  style={{ width: "auto", height: "auto" }} // ✅ Maintain aspect ratio
/>
            <div className="flex flex-col items-center mt-8">
                <h2 className="font-bold text-[40px] py-3">
                    What should we call your Folder?
                </h2>
                <h2 className="text-gray-500">
                    You can always change this later from settings.
                </h2>
                <div className="mt-7 w-[40%]">
                    <label className="text-gray-500">Folder Name</label>
                    <Input
                        placeholder="Folder Name"
                        className="mt-3"
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-blue-500 mt-9 w-[30%] hover:bg-blue-600"
                    disabled={!(teamName && teamName?.length > 0)}
                    onClick={() => createNewTeam()}
                >
                    Create Folder
                </Button>
            </div>
        </div>
    );
}

export default CreateTeam;
