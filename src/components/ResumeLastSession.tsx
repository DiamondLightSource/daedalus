import { useEffect } from "react";
import { useNavigate } from "react-router";

export function ResumeLastSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastSession = localStorage.getItem("lastSession");
    console.log("lastSession", lastSession);

    if (!lastSession) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const session = JSON.parse(lastSession);

      if (session.version !== 1 || !session.pathname) {
        navigate("/", { replace: true });
        return;
      }

      navigate(session.pathname, {
        replace: true,
        state: {
          pageState: session.pageState,
          tabState: session.tabState
        }
      });
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return null;
}
