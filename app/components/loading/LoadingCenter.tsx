import LoadingSpinner from './LoadingSpinner';
export default function LoadingCenter({
  text,
  textColor,
  className,
}: {
  text: string;
  textColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center p-5 text-lightPrimary ${className}`}
    >
      <div
        className={`w-96 bg-inherit p-7 rounded-10 flex flex-col items-center justify-center gap-5 md:gap-8`}
      >
        <LoadingSpinner />
        <h1
          className={`text-lg font-bold leading-7 text-center text-${textColor}`}
        >
          {text}
        </h1>
      </div>
    </div>
  );
}
