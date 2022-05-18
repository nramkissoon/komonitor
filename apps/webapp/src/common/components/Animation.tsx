import React from "react";

export const FadeInView: React.FC<{
  obvProps: IntersectionObserverInit | undefined;
  inAnimation: string;
  outAnimation?: string | undefined;
}> = ({ children, obvProps, inAnimation, outAnimation }) => {
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef<Element>();
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      setVisible(entry.isIntersecting);
    }, obvProps);
    if (domRef.current) observer.observe(domRef.current!);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current!);
    };
  }, [domRef, obvProps]);

  return (
    <div ref={domRef as any} className="relative">
      {/* scaling animation does not work on observed parent element */}
      <div className={isVisible ? inAnimation : outAnimation ?? ""}>
        {children}
      </div>
    </div>
  );
};
