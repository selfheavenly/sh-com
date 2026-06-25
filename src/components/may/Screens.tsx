interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="may-screen">
      <div className="may-stage flex items-center justify-center">
        <p className="may-serif text-[#302c25]/50 text-lg italic">{message}</p>
      </div>
    </div>
  );
}

interface ErrorScreenProps {
  message?: string;
}

export function ErrorScreen({
  message = "Something went wrong.",
}: ErrorScreenProps) {
  return (
    <div className="may-screen">
      <div className="may-stage flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="may-serif text-[#302c25]/60 text-xl">{message}</p>
      </div>
    </div>
  );
}
