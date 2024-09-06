import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth/next";
import React from "react";

const Transactions = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return (
      <div>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return <>Transaction authorised.</>;
};

export default Transactions;
