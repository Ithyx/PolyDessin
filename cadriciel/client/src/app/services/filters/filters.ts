export const FILTERS: string[] =
[`<!-- https://developer.mozilla.org/fr/docs/Web/SVG/Element/feGaussianBlur -->
<filter id="Flou" filterUnits="userSpaceOnUse">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
</filter>`,
`<!-- https://developer.mozilla.org/fr/docs/Web/SVG/Element/feOffset -->
<filter id="Surbrillance" filterUnits="userSpaceOnUse">
    <feOffset in="SourceGraphic" dx="60" dy="60" />
    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
    <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
    </feMerge>
</filter>`,
`<!-- https://codepen.io/clovisneto/pen/MbBZEX -->
<filter id="Tremblant" filterUnits="userSpaceOnUse">
    <feTurbulence baseFrequency="0.07" numOctaves="1" type="fractalNoise" seed="1" result="fractalNoise"></feTurbulence>
    <feDisplacementMap scale="20" in="SourceGraphic" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
</filter>`,
`<!-- https://developer.mozilla.org/fr/docs/Web/SVG/Element/feTurbulence -->
<filter id="Tache" filterUnits="userSpaceOnUse">
    <feTurbulence baseFrequency="0.18" numOctaves="5" type="turbulence" seed="3" result="turbulence"/>
    <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="G" yChannelSelector="R"/>
</filter>`,
`<!-- https://developer.mozilla.org/fr/docs/Web/SVG/Element/feDropShadow -->
<filter id="Ombre" filterUnits="userSpaceOnUse">
    <feDropShadow dx="1.5" dy="20" stdDeviation="5"/>
</filter>`];
