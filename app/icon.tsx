import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          {/* <!-- Circular background --> */}
          <circle cx="32" cy="32" r="30" fill="#fb923c" />

          {/* <!-- Q shape --> */}
          <path
            d="M32,10 C19.85,10 10,19.85 10,32 C10,44.15 19.85,54 32,54 C44.15,54 54,44.15 54,32 C54,19.85 44.15,10 32,10 Z M32,50 C22.07,50 14,41.93 14,32 C14,22.07 22.07,14 32,14 C41.93,14 50,22.07 50,32 C50,41.93 41.93,50 32,50 Z"
            fill="#ffa94d"
          />

          {/* <!-- Q tail --> */}
          <path
            d="M40,40 L48,48"
            stroke="#ffa94d"
            stroke-width="5"
            stroke-linecap="round"
          />

          {/* <!-- Narrower blade but same length --> */}
          <path d="M29,32 L35,32 L35,8 L32,2 L29,8 Z" fill="#f1f5f9" />
          <path d="M32,2 L33.5,8 L33.5,32 L32,32 Z" fill="#ffffff" />
          <path d="M32,2 L30.5,8 L30.5,32 L32,32 Z" fill="#e2e8f0" />

          {/* <!-- Sword handle --> */}
          <rect x="30" y="32" width="4" height="10" fill="#7c2d12" />
          {/* <!-- Crossguard (kept wide) --> */}
          <rect x="23" y="32" width="18" height="3" rx="1" fill="#9a3412" />
          {/* <!-- Sword pommel --> */}
          <circle cx="32" cy="44" r="3" fill="#9a3412" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
