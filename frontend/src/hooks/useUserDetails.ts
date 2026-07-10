import type { UserResponse } from "@/types/auth";
import { useEffect, useState } from "react";
import {getCurrentUser} from "@/services/authService";

function useUserDetails() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return { user };
}

export default useUserDetails;