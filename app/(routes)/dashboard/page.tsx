"use client";

import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useConvex, useMutation } from "convex/react";
import { useEffect } from "react";
import FileList from "./_components/FileList";
import Header from "./_components/Header";

const Dashboard = () => {
    const convex = useConvex();
    const { user }: any = useKindeBrowserClient();
    //const getUser=useQuery(api.user.getUser,{email:user?.email});

    const createUser = useMutation(api.user.createUser);
    useEffect(() => {
        if (user) {
            checkUser();
        }
    }, [user]);

    const checkUser = async () => {
        const result = await convex.query(api.user.getUser, {
            email: user?.email,
        });
        if (!result?.length) {
            createUser({
                name: user.given_name,
                email: user.email,
                image: user.image ? user.image : "/rg-logo.jpg", // ✅ Use provided image if available, else fallback
            }).then((resp) => {
                console.log(resp);
            });
        }
    };
    return (
        <div>
            <Header />
            <FileList />
            {/* <Button>
                <LogoutLink>Logout</LogoutLink>
            </Button> */}
        </div>
    );
};

export default Dashboard;
