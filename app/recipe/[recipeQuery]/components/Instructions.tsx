'use client';

import InstructionsIcon from '@/app/assets/svgs/InstructionsIcon';
import RightArrowIcon from '@/app/assets/svgs/RightArrowIcon';
import useWindowSize from '@/app/hooks/useWindowSize';
import { Accordion, AccordionItem } from '@nextui-org/react';

export default function Instructions({
  instructions,
  className,
}: {
  instructions: string[];
  className?: string;
}) {
  const { isMobile } = useWindowSize();
  const content = (
    <ul className='text-base font-medium list-decimal px-10'>
      {instructions.map((instruction) => (
        <li key={instruction} className='py-0.5'>
          {instruction}
        </li>
      ))}
    </ul>
  );
  return isMobile ? (
    <Accordion variant='shadow' className={`font-medium ${className}`}>
      <AccordionItem
        key='1'
        aria-label='Instructions'
        title='Instructions'
        startContent={<InstructionsIcon />}
        indicator={<RightArrowIcon />}
      >
        {content}
      </AccordionItem>
    </Accordion>
  ) : (
    <section className={`w-full flex-col gap-4 flex ${className}`}>
      <div className='flex gap-4 items-center'>
        <InstructionsIcon />
        <h3 className='font-medium text-2xl italic'>Instructions</h3>
      </div>
      {content}
    </section>
  );
}
