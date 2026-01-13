
// This file simulates a CMS (Content Management System) database.
// In a real application, this data would be fetched from an API or database.
// The Admin Portal would write to this source.

export interface BankDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    accountType: string;
}

export const bankDetails: BankDetails = {
    bankName: "BANK OF BARODA",
    accountName: "NEW DEFENCE PUBLIC SCHOOL",
    accountNumber: "16840200000657",
    ifscCode: "BARB0AGSHAH",
    branchName: "SHAHGANJ, AGRA - 282010, U.P.",
    accountType: "CURRENT"
};

export const razorpayLink = "https://pages.razorpay.com/pl_FKCpuRtZN3r2XU/view";

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'event' | 'news' | 'holiday';
    highlight?: boolean;
}

export const schoolNewsEvents: NewsItem[] = [
    // Example data - The admin would populate this.
    // {
    //     id: '1',
    //     title: 'Annual Sports Day',
    //     description: 'Join us for the 25th Annual Sports Day celebration at the main ground.',
    //     date: '2024-02-15',
    //     type: 'event',
    //     highlight: true
    // },
    // {
    //     id: '2',
    //     title: 'Winter Break',
    //     description: 'School will remain closed for winter break from Dec 25th to Jan 5th.',
    //     date: '2023-12-25',
    //     type: 'holiday'
    // }
];

export const galleryImages = {
    events: [
        "/images/slider/01.jpg",
        "/images/slider/02.jpg",
        "/images/slider/04.jpg",
        "/images/slider/05.jpg",
        "/images/slider/06.jpg",
        "/images/slider/07.jpg",
        "/images/slider/08.jpg",
        "/images/slider/09.jpg",
        "/images/achievements/ach1.jpg",
        "/images/achievements/ach2.jpg",
        "/images/gallery/christmas1.jpg",
    ],
    infrastructure: [
        "/images/infrastructure/fl1.jpg",
        "/images/infrastructure/fl10.jpg",
        "/images/infrastructure/fl7.jpg",
        "/images/infrastructure/fl9.jpg",
        "/images/infrastructure/01.jpg",
        "/images/infrastructure/12.jpg",
        "/images/infrastructure/transport.jpg",
        "/images/gen/smart_classroom_india_1766952364269.png",
    ]
};
