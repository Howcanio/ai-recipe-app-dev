import PromptItem from './PromptItem';

export default function PromptList({
  prompts,
  className,
}: {
  prompts: Prompt[] | [];
  className?: string;
}) {
  const note =
    'NOTE! Dynamic values, for example ${meal}, must be written in that format: ${value}';
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h1 className='text-xl font-bold text-danger-500'>{note}</h1>
      {prompts?.map((prompt) => (
        <PromptItem key={prompt.name} prompt={prompt} className='' />
      ))}
    </div>
  );
}
