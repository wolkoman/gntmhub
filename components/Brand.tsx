import {useUser} from "@auth0/nextjs-auth0";
import {useCandidateStore, useQuestionStore, useUserStore} from "../util/client";
import Link from "next/link";

export function Brand() {
    const [{isLoading: userLoading}, storeLoading, user, questionLoading] = [
        useUser(),
        useCandidateStore(store => store.loading),
        useUserStore(store => store.user),
        useQuestionStore(store => store.loading)
    ];
    useUserStore(store => store.load());
    const loading = userLoading || storeLoading || questionLoading;

    return <Link href="/app">
        <div className="cursor-pointer relative overflow-hidden">
            <div className={`absolute top-1.5 h-5 w-12 bg-primary loader transition ${loading ? '' : 'opacity-0'}`}/>
            <svg width="290" height="47" viewBox="0 0 290 47" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className="w-36 h-8 relative z-10">
                <g clipPath="url(#clip0_9_28)">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M327 0H0V75H327V0ZM28.37 17.2962C27.7395 16.2578 26.8679 15.4604 25.7552 14.904C24.6796 14.3477 23.4001 14.0695 21.9166 14.0695C19.172 14.0695 17.0023 14.9597 15.4075 16.7399C13.8498 18.5202 13.0709 20.9124 13.0709 23.9165C13.0709 27.2916 13.9054 29.8693 15.5744 31.6495C17.2805 33.3927 19.7469 34.2643 22.9736 34.2643C26.7937 34.2643 29.5197 32.5396 31.1516 29.0904H20.1919V21.2462H40.5535V31.8164C39.7005 33.8934 38.4395 35.8405 36.7705 37.6579C35.1386 39.4752 33.0617 40.9773 30.5396 42.1641C28.0176 43.3139 25.1433 43.8887 21.9166 43.8887C17.9852 43.8887 14.4988 43.0542 11.4576 41.3853C8.45341 39.6792 6.11683 37.3241 4.44784 34.3199C2.81595 31.2786 2 27.8108 2 23.9165C2 20.0593 2.81595 16.6287 4.44784 13.6245C6.11683 10.5832 8.45341 8.22809 11.4576 6.55911C14.4618 4.85303 17.9295 4 21.8609 4C26.7937 4 30.8734 5.18683 34.1001 7.5605C37.3268 9.93417 39.3296 13.1794 40.1085 17.2962H28.37ZM81.7683 43.6106H70.8643L56.3441 21.6912V43.6106H45.4401V4.38943H56.3441L70.8643 26.5869V4.38943H81.7683V43.6106ZM117.521 13.0681V4.38943H85.81V13.0681H96.1577V43.6106H107.062V13.0681H117.521ZM167.341 4.38943V43.6106H156.437V21.9694L149.038 43.6106H139.914L132.459 21.8025V43.6106H121.555V4.38943H134.74L144.587 29.8693L154.211 4.38943H167.341ZM208.652 43.6106V4.38943H197.748V19.1321H184.452V4.38943H173.548V43.6106H184.452V27.8665H197.748V43.6106H208.652ZM225.574 4.38943V27.1433C225.574 29.2573 226.056 30.8892 227.02 32.0389C228.021 33.1887 229.523 33.7636 231.526 33.7636C233.529 33.7636 235.031 33.1887 236.033 32.0389C237.071 30.8521 237.59 29.2202 237.59 27.1433V4.38943H248.494V27.1433C248.494 30.7408 247.734 33.8192 246.213 36.3783C244.693 38.9003 242.616 40.8104 239.982 42.1085C237.386 43.3695 234.493 44 231.304 44C228.114 44 225.258 43.3695 222.736 42.1085C220.251 40.8104 218.286 38.9003 216.839 36.3783C215.43 33.8563 214.725 30.7779 214.725 27.1433V4.38943H225.574ZM284.985 26.9207C283.649 25.1405 281.832 23.9907 279.533 23.4715C281.535 22.9152 283.13 21.8767 284.317 20.356C285.541 18.7983 286.153 16.8697 286.153 14.5702C286.153 11.3435 285.003 8.84005 282.704 7.05981C280.441 5.27955 277.307 4.38943 273.302 4.38943H254.498V43.6106H273.914C278.068 43.6106 281.294 42.6648 283.594 40.7733C285.893 38.8818 287.043 36.267 287.043 32.9291C287.043 30.6667 286.357 28.6639 284.985 26.9207ZM270.91 19.9666H265.402V13.0681H270.91C273.654 13.0681 275.026 14.2364 275.026 16.573C275.026 18.8354 273.654 19.9666 270.91 19.9666ZM275.861 31.3714C275.861 33.6708 274.489 34.8206 271.744 34.8206H265.402V27.6996H271.688C273.024 27.6996 274.044 28.0148 274.748 28.6453C275.49 29.2758 275.861 30.1845 275.861 31.3714Z"
                          className="fill-white dark:fill-black dark-fill-black"/>
                    <mask id="path-2-inside-1_9_28" fill="white">
                        <path
                            d="M28.37 17.2962C27.7395 16.2578 26.8679 15.4604 25.7552 14.904C24.6796 14.3477 23.4001 14.0695 21.9166 14.0695C19.172 14.0695 17.0023 14.9597 15.4075 16.7399C13.8498 18.5202 13.0709 20.9124 13.0709 23.9165C13.0709 27.2916 13.9054 29.8693 15.5744 31.6495C17.2805 33.3927 19.7469 34.2643 22.9736 34.2643C26.7937 34.2643 29.5197 32.5396 31.1516 29.0904H20.1919V21.2462H40.5535V31.8164C39.7005 33.8934 38.4395 35.8405 36.7705 37.6579C35.1386 39.4752 33.0617 40.9773 30.5396 42.1641C28.0176 43.3139 25.1433 43.8887 21.9166 43.8887C17.9852 43.8887 14.4988 43.0542 11.4576 41.3853C8.45341 39.6792 6.11683 37.3241 4.44784 34.3199C2.81595 31.2786 2 27.8108 2 23.9165C2 20.0593 2.81595 16.6287 4.44784 13.6245C6.11683 10.5832 8.45341 8.22809 11.4576 6.55911C14.4618 4.85304 17.9295 4 21.8609 4C26.7937 4 30.8734 5.18683 34.1001 7.5605C37.3268 9.93417 39.3296 13.1794 40.1085 17.2962H28.37Z"/>
                        <path
                            d="M81.7684 43.6106H70.8643L56.3441 21.6912V43.6106H45.4401V4.38943H56.3441L70.8643 26.5869V4.38943H81.7684V43.6106Z"/>
                        <path d="M117.521 4.38943V13.0681H107.062V43.6106H96.1577V13.0681H85.81V4.38943H117.521Z"/>
                        <path
                            d="M167.341 4.38943V43.6106H156.437V21.9694L149.038 43.6106H139.914L132.459 21.8025V43.6106H121.555V4.38943H134.74L144.587 29.8693L154.211 4.38943H167.341Z"/>
                        <path
                            d="M208.652 4.38943V43.6106H197.748V27.8665H184.452V43.6106H173.548V4.38943H184.452V19.1321H197.748V4.38943H208.652Z"/>
                        <path
                            d="M225.574 4.38943V27.1433C225.574 29.2573 226.056 30.8892 227.02 32.0389C228.021 33.1887 229.523 33.7636 231.526 33.7636C233.529 33.7636 235.031 33.1887 236.033 32.0389C237.071 30.8521 237.59 29.2202 237.59 27.1433V4.38943H248.494V27.1433C248.494 30.7408 247.734 33.8192 246.213 36.3783C244.693 38.9003 242.616 40.8104 239.982 42.1085C237.386 43.3695 234.493 44 231.304 44C228.114 44 225.258 43.3695 222.736 42.1085C220.251 40.8104 218.286 38.9003 216.839 36.3783C215.43 33.8563 214.725 30.7779 214.725 27.1433V4.38943H225.574Z"/>
                        <path
                            d="M279.533 23.4715C281.832 23.9907 283.649 25.1405 284.985 26.9207C286.357 28.6639 287.043 30.6667 287.043 32.9291C287.043 36.267 285.893 38.8818 283.594 40.7733C281.294 42.6648 278.068 43.6106 273.914 43.6106H254.498V4.38943H273.302C277.307 4.38943 280.441 5.27955 282.704 7.05981C285.003 8.84005 286.153 11.3435 286.153 14.5702C286.153 16.8697 285.541 18.7983 284.317 20.356C283.13 21.8767 281.535 22.9152 279.533 23.4715ZM265.402 19.9666H270.91C273.654 19.9666 275.026 18.8354 275.026 16.573C275.026 14.2364 273.654 13.0681 270.91 13.0681H265.402V19.9666ZM271.744 34.8206C274.489 34.8206 275.861 33.6708 275.861 31.3714C275.861 30.1845 275.49 29.2758 274.748 28.6453C274.044 28.0148 273.024 27.6996 271.688 27.6996H265.402V34.8206H271.744Z"/>
                    </mask>
                    <path
                        d="M28.37 17.2962C27.7395 16.2578 26.8679 15.4604 25.7552 14.904C24.6796 14.3477 23.4001 14.0695 21.9166 14.0695C19.172 14.0695 17.0023 14.9597 15.4075 16.7399C13.8498 18.5202 13.0709 20.9124 13.0709 23.9165C13.0709 27.2916 13.9054 29.8693 15.5744 31.6495C17.2805 33.3927 19.7469 34.2643 22.9736 34.2643C26.7937 34.2643 29.5197 32.5396 31.1516 29.0904H20.1919V21.2462H40.5535V31.8164C39.7005 33.8934 38.4395 35.8405 36.7705 37.6579C35.1386 39.4752 33.0617 40.9773 30.5396 42.1641C28.0176 43.3139 25.1433 43.8887 21.9166 43.8887C17.9852 43.8887 14.4988 43.0542 11.4576 41.3853C8.45341 39.6792 6.11683 37.3241 4.44784 34.3199C2.81595 31.2786 2 27.8108 2 23.9165C2 20.0593 2.81595 16.6287 4.44784 13.6245C6.11683 10.5832 8.45341 8.22809 11.4576 6.55911C14.4618 4.85304 17.9295 4 21.8609 4C26.7937 4 30.8734 5.18683 34.1001 7.5605C37.3268 9.93417 39.3296 13.1794 40.1085 17.2962H28.37Z"
                        strokeWidth="2" strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"
                        className="stroke-black dark:stroke-white dark-stroke-white"/>
                    <path
                        d="M81.7684 43.6106H70.8643L56.3441 21.6912V43.6106H45.4401V4.38943H56.3441L70.8643 26.5869V4.38943H81.7684V43.6106Z"
                        className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                        strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                    <path d="M117.521 4.38943V13.0681H107.062V43.6106H96.1577V13.0681H85.81V4.38943H117.521Z"
                          className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                          strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                    <path
                        d="M167.341 4.38943V43.6106H156.437V21.9694L149.038 43.6106H139.914L132.459 21.8025V43.6106H121.555V4.38943H134.74L144.587 29.8693L154.211 4.38943H167.341Z"
                        className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                        strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                    <path
                        d="M208.652 4.38943V43.6106H197.748V27.8665H184.452V43.6106H173.548V4.38943H184.452V19.1321H197.748V4.38943H208.652Z"
                        className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                        strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                    <path
                        d="M225.574 4.38943V27.1433C225.574 29.2573 226.056 30.8892 227.02 32.0389C228.021 33.1887 229.523 33.7636 231.526 33.7636C233.529 33.7636 235.031 33.1887 236.033 32.0389C237.071 30.8521 237.59 29.2202 237.59 27.1433V4.38943H248.494V27.1433C248.494 30.7408 247.734 33.8192 246.213 36.3783C244.693 38.9003 242.616 40.8104 239.982 42.1085C237.386 43.3695 234.493 44 231.304 44C228.114 44 225.258 43.3695 222.736 42.1085C220.251 40.8104 218.286 38.9003 216.839 36.3783C215.43 33.8563 214.725 30.7779 214.725 27.1433V4.38943H225.574Z"
                        className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                        strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                    <path
                        d="M279.533 23.4715C281.832 23.9907 283.649 25.1405 284.985 26.9207C286.357 28.6639 287.043 30.6667 287.043 32.9291C287.043 36.267 285.893 38.8818 283.594 40.7733C281.294 42.6648 278.068 43.6106 273.914 43.6106H254.498V4.38943H273.302C277.307 4.38943 280.441 5.27955 282.704 7.05981C285.003 8.84005 286.153 11.3435 286.153 14.5702C286.153 16.8697 285.541 18.7983 284.317 20.356C283.13 21.8767 281.535 22.9152 279.533 23.4715ZM265.402 19.9666H270.91C273.654 19.9666 275.026 18.8354 275.026 16.573C275.026 14.2364 273.654 13.0681 270.91 13.0681H265.402V19.9666ZM271.744 34.8206C274.489 34.8206 275.861 33.6708 275.861 31.3714C275.861 30.1845 275.49 29.2758 274.748 28.6453C274.044 28.0148 273.024 27.6996 271.688 27.6996H265.402V34.8206H271.744Z"
                        className="stroke-black dark:stroke-white dark-stroke-white" strokeWidth="2"
                        strokeMiterlimit="6.98792" mask="url(#path-2-inside-1_9_28)"/>
                </g>
                <defs>
                    <clipPath id="clip0_9_28">
                        <rect width="290" height="47" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    </Link>;
}