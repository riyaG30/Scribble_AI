"use client";

import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const Dashboard = () => {
    return (
        <div>
            Dashboard
            <Button>
                <LogoutLink>Logout</LogoutLink>
            </Button>
        </div>
    );
};

export default Dashboard;
