import { FC, Suspense, useState } from "react";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import CakeIcon from "@mui/icons-material/Cake";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import Alert from "@mui/joy/Alert";
import CircularProgress from "@mui/joy/CircularProgress";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";

// Set to true to simulate an error when fetching data
// it will succeed on retry
let FAIL_LOADING = false;

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

function useBirths(day: Date) {
    const query = useSuspenseQuery<BirthEntry[]>({
        queryKey: ["wikipedia-birthdays", day],
        queryFn: async () => {
            if (FAIL_LOADING) {
                throw new Error("Simulated error!");
            }

            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${
                    day.getMonth() + 1
                }/${day.getDate()}`
            );

            if (!response.ok) {
                throw new Error("Error fetching births");
            }

            const { births } = (await response.json()) as {
                births: BirthEntry[];
            };
            births.sort((a, b) => b.year - a.year);

            return births;
        },
    });

    return query.data;
}

const Birthdays: FC<{ day: Date }> = ({ day }) => {
    const births = useBirths(day);

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
                {births.map((birth, index) => (
                    // we can use index as key because the list is static
                    <tr key={index}>
                        <td>
                            {birth.pages[0] ? (
                                <Link
                                    href={
                                        birth.pages[0].content_urls.desktop.page
                                    }
                                >
                                    {birth.text.split(",")[0]}
                                </Link>
                            ) : (
                                birth.text.split(",")[0]
                            )}
                        </td>
                        <td>{birth.text.split(",")[1]}</td>
                        <td>{birth.year}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const LoadError: FC<{ day: Date }> = ({ day }) => {
    const queryClient = useQueryClient();
    const { resetBoundary } = useErrorBoundary();

    function refetch() {
        FAIL_LOADING = false;
        resetBoundary();
        queryClient.refetchQueries({
            queryKey: ["wikipedia-birthdays", day],
        });
    }

    return (
        <Alert color="danger">
            Error fetching births for {getPrettyDate(day)}{" "}
            <Button onClick={refetch}>Retry</Button>
        </Alert>
    );
};

function getPrettyDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export const WikipediaBirthdays: FC<{ day: Date }> = ({ day }) => {
    const [showBirthdays, setShowBirthdays] = useState(false);

    return (
        <Stack alignItems="center" spacing={2}>
            <Typography level="h2">{getPrettyDate(day)}</Typography>

            <Button
                startDecorator={<CakeIcon />}
                onClick={() => setShowBirthdays(true)}
            >
                Show birthdays
            </Button>

            {showBirthdays ? (
                <Suspense fallback={<CircularProgress />}>
                    <ErrorBoundary fallback={<LoadError day={day} />}>
                        <Birthdays day={day} />
                    </ErrorBoundary>
                </Suspense>
            ) : null}
        </Stack>
    );
};
