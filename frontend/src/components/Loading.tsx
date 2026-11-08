import "./Loading.css";

interface LoadingProps {
  text?: string;
}

function Loading({ text = "Yuklanmoqda..." }: LoadingProps) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}

export default Loading;
