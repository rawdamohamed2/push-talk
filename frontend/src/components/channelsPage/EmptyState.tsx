import { Link } from "react-router-dom";
interface EmptyStateProps {
  isChannel?: boolean;
}
const EmptyState = ({ isChannel }: EmptyStateProps) => {
  return (
    <section className={`bg-muted min-h-[300px] rounded-2xl py-4`}>
      <div
        className={`container flex flex-col justify-center items-center h-full gap-5 `}
      >
        <div className={`flex justify-center items-center`}>
          <span className={` w-fit h-fit`}>
            <svg
              width="180"
              height="180"
              viewBox="0 0 296 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="20"
                width="256"
                height="256"
                rx="128"
                fill="url(#paint0_linear_135_1262)"
              />
              <g filter="url(#filter0_dd_135_1262)">
                <rect
                  x="20"
                  width="256"
                  height="256"
                  rx="128"
                  fill="white"
                  fill-opacity="0.01"
                  shape-rendering="crispEdges"
                />
              </g>
              <g
                filter="url(#filter1_i_135_1262)"
                data-figma-bg-blur-radius="4"
              >
                <rect
                  x="36"
                  y="16"
                  width="224"
                  height="224"
                  rx="112"
                  fill="#1C2026"
                  fill-opacity="0.6"
                />
                <rect
                  x="60"
                  y="40"
                  width="176"
                  height="176"
                  rx="88"
                  fill="#262A31"
                  fill-opacity="0.3"
                />
              </g>
              <g opacity="0.4">
                <path
                  d="M148 128H276C276 57.3549 218.645 0 148 0V128"
                  fill="url(#paint1_radial_135_1262)"
                />
              </g>
              <rect
                x="60.3333"
                y="80"
                width="175.333"
                height="96"
                rx="16"
                fill="#0A0E14"
                fill-opacity="0.9"
              />
              <g filter="url(#filter2_dd_135_1262)">
                <rect
                  x="60.3333"
                  y="80"
                  width="175.02"
                  height="96"
                  rx="16"
                  fill="white"
                  fill-opacity="0.01"
                  shape-rendering="crispEdges"
                />
              </g>
              <rect
                x="84.3333"
                y="122"
                width="6"
                height="12"
                rx="3"
                fill="#464554"
                fill-opacity="0.4"
              />
              <rect
                x="96.3333"
                y="116"
                width="6"
                height="24"
                rx="3"
                fill="#464554"
                fill-opacity="0.6"
              />
              <rect
                x="108.333"
                y="108"
                width="6"
                height="40"
                rx="3"
                fill="#FFB4AB"
              />
              <rect
                x="120.333"
                y="96"
                width="6"
                height="64"
                rx="3"
                fill="#8083FF"
              />
              <g filter="url(#filter3_d_135_1262)">
                <path
                  d="M139.717 133.425C138.608 132.258 137.767 130.965 137.194 129.546C136.62 128.126 136.333 126.658 136.333 125.142C136.333 123.625 136.62 122.157 137.194 120.737C137.767 119.318 138.608 118.025 139.717 116.858L141.117 118.258C140.183 119.192 139.483 120.266 139.017 121.481C138.55 122.696 138.317 123.917 138.317 125.142C138.317 126.367 138.55 127.587 139.017 128.802C139.483 130.017 140.183 131.092 141.117 132.025L139.717 133.425V133.425M142.517 130.625C141.758 129.867 141.18 129.011 140.781 128.058C140.383 127.105 140.183 126.133 140.183 125.142C140.183 124.15 140.383 123.178 140.781 122.225C141.18 121.272 141.758 120.417 142.517 119.658L143.917 121.058C143.333 121.583 142.896 122.205 142.604 122.925C142.312 123.644 142.167 124.383 142.167 125.142C142.167 125.842 142.312 126.551 142.604 127.271C142.896 127.99 143.333 128.642 143.917 129.225L142.517 130.625V130.625M142.167 139.142L146.104 127.329C145.793 127.057 145.545 126.736 145.36 126.367C145.176 125.997 145.083 125.589 145.083 125.142C145.083 124.325 145.365 123.635 145.929 123.071C146.493 122.507 147.183 122.225 148 122.225C148.817 122.225 149.507 122.507 150.071 123.071C150.635 123.635 150.917 124.325 150.917 125.142C150.917 125.589 150.824 125.997 150.64 126.367C150.455 126.736 150.207 127.057 149.896 127.329L153.833 139.142H151.5L150.742 136.808H145.287L144.5 139.142H142.167V139.142M146.046 134.475H149.954L148 128.642L146.046 134.475V134.475M153.483 130.625L152.083 129.225C152.667 128.7 153.104 128.078 153.396 127.358C153.687 126.639 153.833 125.9 153.833 125.142C153.833 124.442 153.687 123.732 153.396 123.012C153.104 122.293 152.667 121.642 152.083 121.058L153.483 119.658C154.242 120.417 154.806 121.272 155.175 122.225C155.544 123.178 155.758 124.15 155.817 125.142C155.817 126.133 155.617 127.105 155.219 128.058C154.82 129.011 154.242 129.867 153.483 130.625V130.625M156.283 133.425L154.883 132.025C155.817 131.092 156.517 130.017 156.983 128.802C157.45 127.587 157.683 126.367 157.683 125.142C157.683 123.917 157.45 122.696 156.983 121.481C156.517 120.266 155.817 119.192 154.883 118.258L156.283 116.858C157.392 118.025 158.233 119.318 158.806 120.737C159.38 122.157 159.667 123.625 159.667 125.142C159.667 126.658 159.394 128.126 158.85 129.546C158.306 130.965 157.45 132.258 156.283 133.425V133.425"
                  fill="#4CD7F6"
                />
              </g>
              <rect
                x="155.353"
                y="112.858"
                width="8"
                height="8"
                rx="4"
                fill="#FFB4AB"
              />
              <rect
                x="169.667"
                y="100"
                width="6"
                height="56"
                rx="3"
                fill="#4CD7F6"
              />
              <rect
                x="181.667"
                y="114"
                width="6"
                height="28"
                rx="3"
                fill="#FFB4AB"
                fill-opacity="0.7"
              />
              <rect
                x="193.667"
                y="120"
                width="6"
                height="16"
                rx="3"
                fill="#464554"
                fill-opacity="0.4"
              />
              <rect
                x="205.667"
                y="124"
                width="6"
                height="8"
                rx="3"
                fill="#464554"
                fill-opacity="0.2"
              />
              <defs>
                <filter
                  id="filter0_dd_135_1262"
                  x="0"
                  y="0"
                  width="296"
                  height="296"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="6"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_dropShadow_135_1262"
                  />
                  <feOffset dy="8" />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_135_1262"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="5"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect2_dropShadow_135_1262"
                  />
                  <feOffset dy="20" />
                  <feGaussianBlur stdDeviation="12.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_135_1262"
                    result="effect2_dropShadow_135_1262"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_135_1262"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter1_i_135_1262"
                  x="32"
                  y="12"
                  width="232"
                  height="232"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_135_1262"
                  />
                </filter>
                <clipPath
                  id="bgblur_0_135_1262_clip_path"
                  transform="translate(-32 -12)"
                >
                  <rect x="36" y="16" width="224" height="224" rx="112" />
                </clipPath>
                <filter
                  id="filter2_dd_135_1262"
                  x="40.3333"
                  y="80"
                  width="215.02"
                  height="136"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="6"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_dropShadow_135_1262"
                  />
                  <feOffset dy="8" />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_135_1262"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="5"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect2_dropShadow_135_1262"
                  />
                  <feOffset dy="20" />
                  <feGaussianBlur stdDeviation="12.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_135_1262"
                    result="effect2_dropShadow_135_1262"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_135_1262"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter3_d_135_1262"
                  x="124.333"
                  y="104.858"
                  width="47.3334"
                  height="46.2833"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="6" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.298039 0 0 0 0 0.843137 0 0 0 0 0.964706 0 0 0 0.6 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_135_1262"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_135_1262"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_135_1262"
                  x1="148"
                  y1="0"
                  x2="148"
                  y2="256"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#262A31" stop-opacity="0.4" />
                  <stop offset="1" stop-color="#262A31" stop-opacity="0" />
                </linearGradient>
                <radialGradient
                  id="paint1_radial_135_1262"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(212 64) scale(64)"
                >
                  <stop stop-color="#4CD7F6" stop-opacity="0.3" />
                  <stop offset="0.7" stop-color="#8083FF" stop-opacity="0.08" />
                  <stop offset="1" stop-color="#8083FF" stop-opacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </span>
        </div>
        <h2
          className={`text-center text-4xl font-bold tracking-[-0.8px] leading-[40px]`}
        >
          Channel Not Found
        </h2>
        <p
          className={`text-sm text-center leading-[22px] text-muted-foreground`}
        >
          The channel
          <span className={`text-secondary px-2 py-1 bg-card rounded-md mx-2`}>
            #unknown-frequency
          </span>
          does not exist, was decommissioned, or your
          <br />
          security key lacks frequency clearance.
        </p>
        {isChannel && (
          <Link
            to={"/channels"}
            className={`bg-primary-fixed-dim text-primary-foreground hover:bg-primary-fixed-dim/80 rounded-md p-2 flex items-center gap-2 h-10`}
          >
            <span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.58333 12.0833L10.4167 10.4167L12.0833 4.58333L6.25 6.25L4.58333 12.0833V12.0833M8.33333 9.58333C7.98611 9.58333 7.69097 9.46181 7.44792 9.21875C7.20486 8.97569 7.08333 8.68056 7.08333 8.33333C7.08333 7.98611 7.20486 7.69097 7.44792 7.44792C7.69097 7.20486 7.98611 7.08333 8.33333 7.08333C8.68056 7.08333 8.97569 7.20486 9.21875 7.44792C9.46181 7.69097 9.58333 7.98611 9.58333 8.33333C9.58333 8.68056 9.46181 8.97569 9.21875 9.21875C8.97569 9.46181 8.68056 9.58333 8.33333 9.58333V9.58333M8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667V16.6667M8.33333 15C10.1806 15 11.7535 14.3507 13.0521 13.0521C14.3507 11.7535 15 10.1806 15 8.33333C15 6.48611 14.3507 4.91319 13.0521 3.61458C11.7535 2.31597 10.1806 1.66667 8.33333 1.66667C6.48611 1.66667 4.91319 2.31597 3.61458 3.61458C2.31597 4.91319 1.66667 6.48611 1.66667 8.33333C1.66667 10.1806 2.31597 11.7535 3.61458 13.0521C4.91319 14.3507 6.48611 15 8.33333 15V15M8.33333 8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333"
                  fill="#1000A9"
                />
              </svg>
            </span>
            Browse All Channels
          </Link>
        )}
      </div>
    </section>
  );
};
export default EmptyState;
