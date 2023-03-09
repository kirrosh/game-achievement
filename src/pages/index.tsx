import { trpc } from "@/utils/trpc";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const login = trpc.session.login.useMutation({
    onSuccess: (res) => {
      router.push(res.redirectUrl);
    },
  });

  return (
    <div>
      <Button onClick={() => login.mutate()}>Login</Button>
    </div>
  );
};

export default Login;
