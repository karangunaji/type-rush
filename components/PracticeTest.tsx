import React, { useState } from "react";
import { useRouter } from "next/navigation";

type PassageOption =
  | "Clerk Passage 1 - Legal Administration"
  | "Clerk Passage 2 - Public Service"
  | "PA Passage 1 - English Practice"
  | "PA Passage 2 - Public Service"
  | "AHC RO/ARO Passage 1 - English Practice"
  | "AHC RO/ARO Passage 2 - Public Service"
  | "AHC English Passage 1 - English Practice"
  | "AHC English Passage 2 - Public Service";
type DurationOption = 10 | 15;
type ExamType = "clerk" | "pa" | "ahcRoAro" | "ahcEnglish";

const examPassageOptions: Record<ExamType, PassageOption[]> = {
  clerk: ["Clerk Passage 1 - Legal Administration", "Clerk Passage 2 - Public Service"],
  pa: ["PA Passage 1 - English Practice", "PA Passage 2 - Public Service"],
  ahcRoAro: ["AHC RO/ARO Passage 1 - English Practice", "AHC RO/ARO Passage 2 - Public Service"],
  ahcEnglish: ["AHC English Passage 1 - English Practice", "AHC English Passage 2 - Public Service"],
};

const passageTextMap: Record<PassageOption, string> = {
  "Clerk Passage 1 - Legal Administration":
    "The way we spend time beyond duty is deeply personal and should remain so. Leisure, when free from scrutiny, is not an innate right, but something hard-won, often claimed with resistance. The concept of women relaxing was alien to most of us growing up. Every time we turned around to catch a glimpse of our mothers and aunts, supposedly at their leisure hour, their hands were always busy making pickles, knitting, handpicking stones from grains, checking the children's scalp for lice, shelling peas, mending clothes primarily busy prepping for the next meal, the next season, the next reason and the next lesson. Every exploration to comprehend women's need for leisure unearths a layer determined by society. If it fits the definition, one has earned it. If it doesn't, it's considered a threat to social order. Historically, women have endured without really living and survived without thriving. Whether it was the lack of time or space or just consideration, our women ancestors were denied the privilege of privacy something our daughters now rightfully demand. I barely saw my mother and aunts slow down during their prime. Age slowed them down, not duties and responsibilities. The word 'boredom' was thrown around a lot during my adolescence. Oblivious to its procedures and practices, my mother naively asked what getting bored entailed. Cut to the 2000s. We insist our children get bored so they acquaint themselves with the spirit of slowness. Being materialistically strong doesn't prevent us from experiencing discontent in our regular lives, which gets consumed by roles set for us. Our feelings of inadequacy stem from inequitable physical and emotional labour. Access to leisure liberates us from the drudgeries of life. Religion as leisure is a huge escape since it has social sanction. Another was answering nature's call in rural India, which was reduced with the advent of toilets inside houses. Twice a day, women were allowed to step out in groups to congregate under the celestial bodies. An opportunity in the guise of attending to one's physiological needs was a luxury they were afforded by the community to connect with fellow sisters. Exhaustion, for both men and women, has always held different meanings. As has the idea of rest. The concept of switching off carries with its tremendous mental load for womenfolk. Leisure doesn't completely entail the 'radical act of doing nothing'. Even in leisure hour, a woman is invariably seen.",
  "Clerk Passage 2 - Public Service":
    "Public service asks for patience, perseverance and the ability to shape systems that work for people. Every community depends on a web of effort that rarely gets noticed, and a public servant often finds meaning in service rather than praise. This passage is a placeholder for the public service prompt.",
  "PA Passage 1 - English Practice":
    "PA practice passage one is focused on administrative language and precise expressions, helping candidates type with clarity and pace.",
  "PA Passage 2 - Public Service":
    "This passage supports practice for public service language, reinforcing speed and accuracy in a formal context.",
  "AHC RO/ARO Passage 1 - English Practice":
    "AHC RO/ARO passage one is designed to help ease candidates into the style of question paper language and court-related typing prompts.",
  "AHC RO/ARO Passage 2 - Public Service":
    "This AHC RO/ARO passage is a practice prompt aimed at improving flow and consistency for exam preparation.",
  "AHC English Passage 1 - English Practice":
    "AHC English passage one helps build simple English typing stamina with standard sentence structure and easy vocabulary.",
  "AHC English Passage 2 - Public Service":
    "This passage prepares candidates for general English typing practice in the context of public service and court administration.",
};

const examInfo: Record<ExamType, {
  title: string;
  aboutText: string;
  previewText: string;
  post: string;
  targetNetSpeed: string;
  passageLength: string;
  testDuration: string;
  maximumMarks: string;
  qualifyingMarks: string;
  languages: string;
  words: string;
  totalTests: string;
  studentsUsing: string;
  timeDuration: string;
  livePassages: string;
}> = {
  clerk: {
    title: "BHC Clerk Exam Info",
    aboutText:
      "The High Court of Judicature at Bombay, has released notification for the post of Clerk for total of 129 positions. In the second stage of recruitment, there will be an English typing test for candidates who pass the screening/ written exam. The typing test will require to type 400 words in 10 minutes at a speed of 40 words per minute. This test is worth a maximum of 20 marks, and one need at least 10 marks to qualify. Please note that for each 4 incorrect word typed, 1 mark will be deducted. AR Typing Platform provides typing interface with Backspace on/ off and On screen/ off screen typing facility. For detailed typing instructions please visit the Typing Tips Section of the AR Typing Platform.",
    previewText:
      "The High Court of Judicature at Bombay, has released notification for the post of Clerk for total of 129 positions. In the second stage of recruitment, there will be an English typing test for candidates who pass the screening/ written exam. The typing test will require to type 400 words in 10 minutes at a speed of 40 words per minute. This test is worth a maximum of 20 marks, and one need at least 10 marks to qualify.",
    post: "Clerk",
    targetNetSpeed: "40 WPM",
    passageLength: "400 words",
    testDuration: "10 minutes",
    maximumMarks: "20",
    qualifyingMarks: "10",
    languages: "English",
    words: "400",
    totalTests: "—",
    studentsUsing: "—",
    timeDuration: "00:10:00 min.",
    livePassages: "Daily 6 new Passages",
  },
  pa: {
    title: "Bombay High Court PA English Typing (BHC)",
    aboutText:
      "The High Court of Judicature at Bombay, Nagpur Bench, has released a notification for the recruitment of Personal Assistants (PA) and Stenographers (Higher Grade and Lower Grade). In the second stage of the recruitment process, candidates who qualify in the stenography skill test will appear for an English typing test. For the Personal Assistant post, candidates are required to type approximately 500 words in 10 minutes at a speed of 50 words per minute. The test carries a total of 40 marks, with a minimum of 20 marks needed to qualify. For the Stenographer post, candidates must type 400 words in 10 minutes at a speed of 40 words per minute, with a similar marking system as that of the PA post. It is important to note that for every 4 incorrect words typed, 1 mark will be deducted. The AR Typing Platform provides a user-friendly typing interface with features such as backspace on/off and on-screen/off-screen typing options. For detailed instructions and tips, please visit the Typing Tips section of the AR Typing Platform.",
    previewText:
      "The High Court of Judicature at Bombay, Nagpur Bench, has released a notification for the recruitment of Personal Assistants (PA) and Stenographers (Higher Grade and Lower Grade). In the second stage of the recruitment process, candidates who qualify in the stenography skill test will appear for an English typing test. For the Personal Assistant post, candidates are required to type approximately 500 words in 10 minutes at a speed of 50 words per minute. The test carries a total of 40 marks, with a minimum of 20 marks needed to qualify.",
    post: "PA / Stenographer",
    targetNetSpeed: "50 WPM (PA) / 40 WPM (Stenographer)",
    passageLength: "500 words (PA) / 400 words (Stenographer)",
    testDuration: "10 minutes",
    maximumMarks: "40",
    qualifyingMarks: "20",
    languages: "English",
    words: "510",
    totalTests: "1000+ Tests",
    studentsUsing: "3129 times",
    timeDuration: "00:10:00 min.",
    livePassages: "Daily 6 new Passages",
  },
  ahcRoAro: {
    title: "Allahabad High Court RO/ARO English Typing (AHC)",
    aboutText: "Exam details will be available soon.",
    previewText: "Exam details will be available soon.",
    post: "RO / ARO",
    targetNetSpeed: "TBD",
    passageLength: "500 words",
    testDuration: "20 minutes",
    maximumMarks: "TBD",
    qualifyingMarks: "TBD",
    languages: "English",
    words: "500",
    totalTests: "1000+ Tests",
    studentsUsing: "172866 times",
    timeDuration: "00:20:00 min.",
    livePassages: "Daily 6 new Passages",
  },
  ahcEnglish: {
    title: "Allahabad High Court English Typing (AHC)",
    aboutText:
      "The High Court of Judicature in Allahabad has announced the recruitment for Group C positions, including Stenographer Grade-III and Junior Assistant, with a total of 1,667 vacancies. Each position requires candidates to take an English and Hindi typing test, each worth 25 marks. The typing tests will last for 10 minutes, with a 300-word passage for English and a 250-word passage for Hindi. Candidates must score a minimum of 10 marks to qualify. For detailed typing instructions for the Allahabad High Court, candidates can visit the Typing Tips section of the AR Typing Platform.",
    previewText:
      "The High Court of Judicature in Allahabad has announced the recruitment for Group C positions, including Stenographer Grade-III and Junior Assistant, with a total of 1,667 vacancies. Each position requires candidates to take an English and Hindi typing test, each worth 25 marks. The typing tests will last for 10 minutes, with a 300-word passage for English and a 250-word passage for Hindi. Candidates must score a minimum of 10 marks to qualify.",
    post: "Group C / Stenographer III / Junior Assistant",
    targetNetSpeed: "TBD",
    passageLength: "300 words",
    testDuration: "10 minutes",
    maximumMarks: "25",
    qualifyingMarks: "10",
    languages: "English",
    words: "300",
    totalTests: "1000+ Tests",
    studentsUsing: "134864 times",
    timeDuration: "00:10:00 min.",
    livePassages: "Daily 6 new Passages",
  },
};

export default function PracticeTest({
  onBeginPractice,
  onBack,
  defaultExam = "clerk",
}: {
  onBeginPractice: (passage: string, duration: DurationOption, allowBackspace: boolean) => void;
  onBack: () => void;
  defaultExam?: ExamType;
}) {
  const passageOptions = examPassageOptions[defaultExam] ?? examPassageOptions.clerk;
  const [passage, setPassage] = useState<PassageOption>(passageOptions[0]);
  const [duration, setDuration] = useState<DurationOption>(10);
  const [allowBackspace, setAllowBackspace] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const selectedInfo = examInfo[defaultExam];

  const selectedPassageText = passageTextMap[passage] ?? passage;
  const router = useRouter();

  return (
    <section className="rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-2xl shadow-slate-950/30">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            router.push("/");
          }}
          className="inline-flex items-center gap-2 rounded-3xl border border-surface bg-surface-alt px-3 py-2 text-sm text-foreground hover:brightness-105 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Test Details</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {selectedInfo.title}
          </h1>
          <div className="mt-6 rounded-3xl border border-surface bg-surface p-5 text-sm text-foreground shadow-inner shadow-slate-950/10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">About</h2>
            <p className="mt-4 leading-7 text-sm text-foreground/90">
              {showMore ? selectedInfo.aboutText : selectedInfo.previewText}
              <button
                type="button"
                onClick={() => setShowMore((current) => !current)}
                className="ml-2 inline-block text-sm font-semibold text-accent underline underline-offset-4 decoration-accent transition hover:text-accent/90 cursor-pointer"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            </p>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl border border-surface bg-surface p-5 text-sm text-foreground shadow-inner shadow-slate-950/10">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Post</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.post}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Target Net Speed</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.targetNetSpeed}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Passage Length</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.passageLength}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Test Duration</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.testDuration}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Maximum Marks</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.maximumMarks}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Qualifying Marks</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.qualifyingMarks}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Languages</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.languages}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Words</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.words}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Total Tests</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.totalTests}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Students using this exam</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.studentsUsing}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Time duration</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.timeDuration}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.24em] text-muted">Live Passages</dt>
                <dd className="mt-2 text-base font-semibold text-foreground">{selectedInfo.livePassages}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-3xl border border-surface-strong bg-surface p-6 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Practice settings</p>

          <div className="mt-6 space-y-5 text-left">
            <label className="block text-sm font-semibold text-muted">
              Select passage
              <select
                value={passage}
                onChange={(event) => setPassage(event.target.value as PassageOption)}
                className="mt-3 w-full rounded-3xl border border-surface-strong bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)]"
              >
                {passageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-muted">
              Select timer
              <select
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value) as DurationOption)}
                className="mt-3 w-full rounded-3xl border border-surface-strong bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)]"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </label>

            <div className="mt-2">
              <label className="inline-flex items-center text-sm font-semibold text-muted">
                <input
                  type="checkbox"
                  checked={allowBackspace}
                  onChange={(e) => setAllowBackspace(e.target.checked)}
                  className="mr-3 h-4 w-4 rounded border-surface-strong bg-surface-strong text-accent focus:ring-accent"
                />
                Enable Backspace during exam
              </label>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-surface p-5 text-left text-sm text-muted ring-1 ring-surface">
            <p className="font-semibold text-foreground">Current selection</p>
            <p className="mt-3">{passage}</p>
            <p className="mt-1">Timer: {duration} minutes</p>
            <p className="mt-1">Backspace: {allowBackspace ? "Enabled" : "Disabled"}</p>
          </div>

          <button
            type="button"
            onClick={() => onBeginPractice(selectedPassageText, duration, allowBackspace)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 cursor-pointer"
          >
            Start practice now
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 inline-flex w-full items-center justify-center rounded-3xl border border-surface-strong bg-surface-alt px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface cursor-pointer"
          >
            Back to level select
          </button>
        </div>
      </div>
    </section>
  );
}
