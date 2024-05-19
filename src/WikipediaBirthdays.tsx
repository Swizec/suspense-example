import { FC, Suspense, useState } from "react";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import CakeIcon from "@mui/icons-material/Cake";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import CircularProgress from "@mui/joy/CircularProgress";
import { useSuspenseQuery } from "@tanstack/react-query";

type BirthEntry = {
    pages: Page[];
    text: string;
    year: number;
};

type Page = Record<string, unknown> & {
    content_urls: { desktop: ContentUrl; mobile: ContentUrl };
};

type ContentUrl = {
    page: string;
    edit: string;
    revisions: string;
    talk: string;
};

const Birthdays: FC<{ day: Date }> = ({ day }) => {
    const query = useSuspenseQuery<BirthEntry[]>({
        queryKey: ["wikipedia-birthdays", day],
        queryFn: async () => {
            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${
                    day.getMonth() + 1
                }/${day.getDate()}`
            );
            const { births } = (await response.json()) as {
                births: BirthEntry[];
            };
            births.sort((a, b) => b.year - a.year);

            return births;
        },
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Notable for</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                {query.data.map((birth, index) => (
                    // we can use index as key because the list is static
                    <tr key={index}>
                        <td>
                            <Link
                                href={birth.pages[0].content_urls.desktop.page}
                            >
                                {birth.text.split(",")[0]}
                            </Link>
                        </td>
                        <td>{birth.text.split(",")[1]}</td>
                        <td>{birth.year}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export const WikipediaBirthdays: FC<{ day: Date }> = ({ day }) => {
    const [showBirthdays, setShowBirthdays] = useState(false);

    return (
        <Stack alignItems="center" spacing={2}>
            <Typography level="h2">
                {day.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                })}
            </Typography>

            <Button
                startDecorator={<CakeIcon />}
                onClick={() => setShowBirthdays(true)}
            >
                Show birthdays
            </Button>

            {showBirthdays ? (
                <Suspense fallback={<CircularProgress />}>
                    <Birthdays day={day} />
                </Suspense>
            ) : null}
        </Stack>
    );
};
