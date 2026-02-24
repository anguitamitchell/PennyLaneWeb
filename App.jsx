const { useState, useEffect, useRef } = React;

function App() {
    // -------------------------------------
    // refs & state
    // -------------------------------------
    const comp = useRef(null);
    const heroTextsRef = useRef([]);
    const [scrolled, setScrolled] = useState(false);

    // Football Data State
    const [standings, setStandings] = useState([]);
    const [nextMatch, setNextMatch] = useState(null);
    const [lfcStats, setLfcStats] = useState(null);

    // Fetch Football Data
    useEffect(() => {
        async function loadData() {
            try {
                const sRes = await fetch('standings.json');
                if (sRes.ok) {
                    const sData = await sRes.json();
                    if (sData.tables && sData.tables[0]) {
                        setStandings(sData.tables[0].entries);
                        const lfc = sData.tables[0].entries.find(e => e.team.id === 10);
                        setLfcStats(lfc);
                    }
                }
                const fRes = await fetch('fixtures.json');
                if (fRes.ok) {
                    const fData = await fRes.json();
                    if (fData.content && fData.content.length > 0) {
                        setNextMatch(fData.content[0]);
                    }
                }
            } catch (e) { console.error("Error loading football data", e); }
        }
        loadData();
    }, []);

    // Track scroll for floating navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // -------------------------------------
    // GSAP Lifecycle
    // -------------------------------------
    useEffect(() => {
        let ctx = gsap.context(() => {
            // A. Hero Animation: Staggered Fade Up
            gsap.from(heroTextsRef.current, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.2
            });

            // B. Philosophy Section Text Reveal (ScrollTrigger)
            gsap.from('.philosophy-text', {
                scrollTrigger: {
                    trigger: '.philosophy-section',
                    start: 'top 75%'
                },
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out'
            });

            // C. Sticky Stacking Archive (Protocol Cards)
            const cards = gsap.utils.toArray('.stack-card');
            cards.forEach((card, index) => {
                const isLast = index === cards.length - 1;
                // Pin logic disabled for simplicity in CDN parsing, using CSS sticky instead
            });

        }, comp);

        return () => ctx.revert();
    }, []);

    // -------------------------------------
    // Custom Interactive Components
    // -------------------------------------

    // Feature 1: Diagnostic Shuffler (Drafts on Tap)
    const ShufflerCard = () => {
        const [items, setItems] = useState([
            "Magners Cider",
            "Fuller's ESB",
            "Old Speckled Hen",
            "Carlsberg",
            "Guinness Stout",
            "Harp Lager",
            "Smithwick's Irish Ale",
            "Firestone Hazy IPA",
            "Firestone Union Jack IPA"
        ]);

        useEffect(() => {
            const interval = setInterval(() => {
                setItems(prev => {
                    const newArr = [...prev];
                    const last = newArr.pop();
                    newArr.unshift(last);
                    return newArr;
                });
            }, 5000);
            return () => clearInterval(interval);
        }, []);

        return (
            <div className="bg-obsidian border border-slate rounded-[2rem] p-8 shadow-2xl relative overflow-hidden h-[340px] flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold font-sans text-ivory mb-2">Drafts on Tap</h3>
                    <p className="text-sm text-ivory/60">Rotating selection of imports and local favorites.</p>
                </div>
                <div className="relative h-[120px]">
                    {items.slice(0, 5).map((item, i) => {
                        const isPrimary = i === 0;
                        return (
                            <div key={item}
                                className={`absolute w-full border p-4 rounded-xl transition-all duration-700 ease-in-out ${isPrimary ? 'bg-[#1a0508] border-liverpoolRed/50 shadow-[0_0_15px_rgba(200,16,46,0.2)] text-liverpoolRed font-bold' : 'bg-[#111] border-slate text-ivory'}`}
                                style={{
                                    bottom: `${i * 15}px`,
                                    transform: `scale(${1 - (i * 0.05)})`,
                                    opacity: 1 - (i * 0.3),
                                    zIndex: 10 - i
                                }}>
                                <span className="font-drama italic text-lg">{item}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    // Feature 1.5: Food Shuffler (Pub Grub)
    const FoodShufflerCard = () => {
        const [items, setItems] = useState([
            { name: "FISH ‘N’ CHIPS", price: "$10.99", desc: "A British staple served up by true Liver-pudlians. Flaky white fish deep fried in our homemade beer batter & served fresh “chip”" },
            { name: "COTTAGE PIE", price: "$14.99", desc: "Ground beef with diced carrots baked in a casserole, topped with peas & whipped potatoes" },
            { name: "BANGERS ‘N’ MASH", price: "$14.99", desc: "English sausages with gravy and garlic mashed potatoes & vegetable medley" },
            { name: "BECKHAM & OWEN", price: "$13.99", desc: "England’s classic scoring combination served up! Pork sausage roll & beef Cornish pasty with garlic mashed potatoes & vegetable medley" },
            { name: "CHICKEN CURRY", price: "Varies", desc: "Our traditional curry served over rice and fries, served American (milder) or English style (hot)" }
        ]);

        useEffect(() => {
            const interval = setInterval(() => {
                setItems(prev => {
                    const newArr = [...prev];
                    const last = newArr.pop();
                    newArr.unshift(last);
                    return newArr;
                });
            }, 5000);
            return () => clearInterval(interval);
        }, []);

        return (
            <div className="bg-obsidian border border-slate rounded-[2rem] p-8 shadow-2xl relative overflow-hidden h-[340px] flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold font-sans text-ivory mb-2">Select Specialties</h3>
                    <p className="text-sm text-ivory/60">A rotating selection of our authentic fare.</p>
                </div>
                <div className="relative h-[130px]">
                    {items.slice(0, 5).map((item, i) => {
                        const isPrimary = i === 0;
                        return (
                            <div key={item.name}
                                className={`absolute w-full border p-4 rounded-xl transition-all duration-700 ease-in-out flex flex-col justify-center ${isPrimary ? 'bg-[#1a0508] border-liverpoolRed/50 shadow-[0_0_15px_rgba(200,16,46,0.2)]' : 'bg-[#111] border-slate text-ivory'}`}
                                style={{
                                    bottom: `${i * 15}px`,
                                    transform: `scale(${1 - (i * 0.05)})`,
                                    opacity: 1 - (i * 0.3),
                                    zIndex: 10 - i
                                }}>
                                <span className={`font-drama italic text-lg ${isPrimary ? 'text-liverpoolRed font-bold' : 'text-ivory'}`}>{item.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };
    // Feature 2: Telemetry Typewriter (Liverpool Stats & Next Match)
    const TypewriterCard = ({ lfcStats, nextMatch }) => {
        const [typed, setTyped] = useState("");
        const [index, setIndex] = useState(0);

        let message = "MATCHDAY INITIATED.\\nLOADING TELEMETRY...";
        if (lfcStats && nextMatch) {
            const team2 = nextMatch.teams[0].team.id === 10 ? nextMatch.teams[1].team.name : nextMatch.teams[0].team.name;
            const gd = lfcStats.overall.goalsDifference;
            message = `> LIVERPOOL FC\\n> POS: ${lfcStats.position} | PTS: ${lfcStats.overall.points} | GD: ${gd > 0 ? '+' : ''}${gd}\\n> NEXT FIXTURE:\\n> ${team2.toUpperCase()}\\n> STATUS: PREPARING...`;
        }

        useEffect(() => {
            setTyped("");
            setIndex(0);
        }, [message]);

        useEffect(() => {
            if (index < message.length) {
                const timeout = setTimeout(() => {
                    setTyped(prev => prev + message.charAt(index));
                    setIndex(index + 1);
                }, 30);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => { setTyped(""); setIndex(0); }, 6000);
                return () => clearTimeout(timeout);
            }
        }, [index, message]);

        return (
            <div className="bg-obsidian border border-slate rounded-[2rem] p-8 shadow-2xl h-[300px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold font-sans text-ivory mb-2">Match Telemetry</h3>
                        <p className="text-sm text-ivory/60">Live LFC stats & broadcast.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate/50 border border-slate text-xs text-ivory/80">
                        <span className="w-2 h-2 rounded-full bg-liverpoolRed animate-pulse"></span>
                        Live Feed
                    </div>
                </div>
                <div className="bg-[#08080c] border border-slate/50 rounded-xl p-4 h-[120px] font-mono text-sm text-liverpoolRed overflow-hidden relative leading-tight">
                    {typed.split('\\n').map((line, i) => <div key={i}>{line}</div>)}
                    <span className="inline-block w-2 h-4 bg-liverpoolRed animate-pulse ml-1 align-middle"></span>
                </div>
            </div>
        );
    };

    // Feature 3: Cursor Protocol Scheduler (Pub Hours)
    const SchedulerCard = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const hoursMap = {
            0: "Sun: 9AM - 9PM",
            1: "Mon: Closed",
            2: "Tue: 3PM - 12AM",
            3: "Wed: 3PM - 12AM",
            4: "Thu: 3PM - 2AM",
            5: "Fri: 3PM - 2AM",
            6: "Sat: 10AM - 2AM"
        };
        const [activeDay, setActiveDay] = useState(new Date().getDay());

        return (
            <div className="bg-obsidian border border-slate rounded-[2rem] p-8 shadow-2xl h-[300px] flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold font-sans text-ivory mb-2">Hours & Location</h3>
                    <p className="text-sm font-mono text-liverpoolRed transition-all duration-300 mb-1">{hoursMap[activeDay]}</p>
                    <p className="text-xs text-ivory/60 font-sans">421 E Franklin St, Richmond, VA<br />804-780-1682</p>
                </div>
                <div className="relative h-[120px] flex items-end">
                    <div className="w-full flex justify-between relative mx-2">
                        {days.map((d, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveDay(i)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-base font-bold border transition-all duration-300 relative z-20 cursor-pointer
                                ${i === activeDay ? 'bg-liverpoolRed border-liverpoolRed text-white scale-110 shadow-[0_0_15px_rgba(200,16,46,0.5)]' : 'bg-slate/30 border-slate text-ivory/50 hover:bg-slate/50'}
                            `}>
                                {d}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div ref={comp} className="bg-obsidian text-ivory min-h-screen">

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full px-6 py-3 flex items-center gap-8
                ${scrolled ? 'bg-obsidian/80 backdrop-blur-xl border border-slate shadow-xl' : 'bg-transparent'}
            `}>
                <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-drama font-bold text-xl tracking-wider text-liverpoolRed italic transition-transform hover:scale-105 cursor-pointer">Penny Lane</a>
                <div className="hidden md:flex gap-6 text-sm font-sans font-medium">
                    <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('#features').scrollIntoView({ behavior: 'smooth' }); }} className="hover:-translate-y-[1px] transition-transform text-ivory/80 hover:text-ivory cursor-pointer">Experience</a>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-4">
                        <a href="https://www.instagram.com/pennylanepub421/" target="_blank" rel="noopener noreferrer" className="text-ivory/80 hover:text-liverpoolRed transition-colors" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://www.facebook.com/PennyLanePubRVA" target="_blank" rel="noopener noreferrer" className="text-ivory/80 hover:text-liverpoolRed transition-colors" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://x.com/pennylanepub" target="_blank" rel="noopener noreferrer" className="text-ivory/80 hover:text-liverpoolRed transition-colors" aria-label="X (Twitter)">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                        </a>
                    </div>
                    <a
                        href="menu.html"
                        className="bg-liverpoolRed text-white px-5 py-2 rounded-full text-sm font-bold btn-magnetic overflow-hidden relative group block shrink-0"
                    >
                        <span className="relative z-10">View Menu</span>
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-full"></span>
                    </a>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative h-[100dvh] flex items-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24">
                <div className="absolute inset-0 z-0">
                    <img
                        src="./header-group.jpg"
                        alt="Pub Interior"
                        className="w-full h-full object-cover object-bottom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-4xl">
                    <div className="overflow-hidden">
                        <h1
                            ref={el => heroTextsRef.current[0] = el}
                            className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight text-ivory mb-2"
                        >
                            A taste of Liverpool
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <h2
                            ref={el => heroTextsRef.current[1] = el}
                            className="font-drama italic text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-liverpoolRed drop-shadow-2xl"
                        >
                            in Richmond.
                        </h2>
                    </div>
                    <div className="overflow-hidden flex gap-4">
                        <a
                            href="menu.html"
                            ref={el => heroTextsRef.current[2] = el}
                            className="bg-liverpoolRed text-white px-8 py-4 rounded-full text-lg font-bold btn-magnetic shadow-lg shadow-liverpoolRed/20 hover:shadow-liverpoolRed/40 transition-all inline-block"
                        >
                            View the Menu
                        </a>
                        <button
                            ref={el => heroTextsRef.current[3] = el}
                            className="bg-slate/50 backdrop-blur-md border border-slate text-ivory px-8 py-4 rounded-full text-lg font-medium btn-magnetic hover:bg-slate transition-all"
                        >
                            Upcoming Matches
                        </button>
                    </div>
                </div>
            </section>

            {/* --- THE FOUNDATION (Culture & Hours) --- */}
            <section id="features" className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="font-mono text-liverpoolRed mb-4 border border-liverpoolRed/30 px-3 py-1 rounded-full text-sm inline-block">OUR HOME</span>
                            <h2 className="font-drama italic text-5xl md:text-6xl text-ivory">A Corner of Liverpool in Virginia.</h2>
                        </div>
                        <p className="font-sans text-ivory/70 text-lg leading-relaxed">
                            Terry, Rose, Terence, and Lisa — and in a few years, Kate, Evan, and Landon — invite you to join the family here in their corner of Liverpool. Penny Lane is a tribute to all things English, from the beers on tap to the football on the telly to the memorabilia that fills every square inch of the pub. Enjoy a bite or a pint from the best tap selection in Central Virginia. Relax downstairs at the bar with old mates, while making some new ones. Play darts or pool upstairs. Savor a fab meal. Hold a meeting or celebrate a special occasion in our private dining room. You don’t have to be a “Scouse” to feel at home here, but you’ll feel a little like one by the time you leave.
                        </p>
                        <div className="pt-4">
                            <SchedulerCard />
                        </div>
                    </div>
                    <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                        <img
                            src="./corner-interior.jpg"
                            alt="Pub Atmosphere"
                            className="w-full h-full object-cover transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* --- THE FARE (Food & Drink) --- */}
            <section className="py-24 px-6 md:px-16 lg:px-24 bg-slate/10 border-y border-slate">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
                        <img
                            src="./guinness-stout.jpg"
                            alt="Proper Pint and Food"
                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent"></div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-8">
                        <div>
                            <span className="font-mono text-liverpoolRed mb-4 border border-liverpoolRed/30 px-3 py-1 rounded-full text-sm inline-block">THE PROPER PINT</span>
                            <h2 className="font-drama italic text-5xl md:text-6xl text-ivory">British Classics.</h2>
                        </div>
                        <p className="font-sans text-ivory/70 text-lg leading-relaxed mb-4">
                            Our draft lines flow with the finest imports straight from the UK. Pair your pint with our renowned savory Shepherd's Pie with golden mash, or the flawlessly battered, classic Fish & Chips. No shortcuts, just authentic English comfort food.
                        </p>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 w-full max-w-[800px]">
                            <ShufflerCard />
                            <FoodShufflerCard />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MATCHDAY (Live Football Data) --- */}
            <section className="py-32 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-liverpoolRed/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <span className="font-mono text-liverpoolRed border border-liverpoolRed/30 px-3 py-1 rounded-full text-sm inline-block">THE RED WALL</span>
                    <h2 className="font-drama italic text-5xl md:text-6xl text-ivory">The Authentic Matchday Ritual.</h2>
                    <p className="font-sans text-ivory/70 text-lg leading-relaxed">
                        No delays. No buffering. We broadcast every English Premier League match live. The atmosphere here is as close to Anfield as you can get on this side of the Atlantic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <TypewriterCard lfcStats={lfcStats} nextMatch={nextMatch} />
                    <div className="h-[300px] rounded-[2rem] overflow-hidden shadow-2xl relative group">
                        <img
                            src="https://images.unsplash.com/photo-1522778526097-ce0a22ceb653?q=80&w=2670&auto=format&fit=crop"
                            alt="Matchday Atmosphere"
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent">
                            <p className="font-mono text-liverpoolRed text-xl border-l-4 border-liverpoolRed pl-4">YOU'LL NEVER WALK ALONE</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER / CTA --- */}
            <footer className="mt-24 pt-24 pb-12 px-6 md:px-16 lg:px-24 bg-slate/20 rounded-t-[4rem] border-t border-slate">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8 mb-24">
                    <div className="max-w-md">
                        <h2 className="font-drama italic text-4xl text-ivory mb-6">Join the Family.</h2>
                        <button className="bg-liverpoolRed text-white px-8 py-4 rounded-full text-lg font-bold btn-magnetic shadow-lg shadow-liverpoolRed/20 hover:shadow-liverpoolRed/40 transition-all mb-8">
                            View the Menu
                        </button>
                        <div className="flex items-center gap-6 mt-2">
                            <a href="https://www.instagram.com/pennylanepub421/" target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-liverpoolRed transition-colors" aria-label="Instagram">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://www.facebook.com/PennyLanePubRVA" target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-liverpoolRed transition-colors" aria-label="Facebook">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="https://x.com/pennylanepub" target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-liverpoolRed transition-colors" aria-label="X (Twitter)">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-12 font-sans">
                        <div>
                            <h4 className="text-ivory font-bold mb-4">Location</h4>
                            <ul className="text-ivory/60 space-y-2 text-sm">
                                <li>421 East Franklin Street</li>
                                <li>Richmond, VA 23219</li>
                                <li>804-780-1682</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-ivory font-bold mb-4">Hours</h4>
                            <ul className="text-ivory/60 space-y-2 text-sm">
                                <li>Mon: Closed</li>
                                <li>Tue-Wed: 3PM - 12AM</li>
                                <li>Thu-Fri: 3PM - 2AM</li>
                                <li>Sat: 10AM - 2AM</li>
                                <li>Sun: 9AM - 9PM</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-slate pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-ivory/40 text-sm font-sans">&copy; 2026 Penny Lane Pub - Cinematic.</p>

                    {/* System Operational Indicator */}
                    <div className="flex items-center gap-3 bg-obsidian px-4 py-2 rounded-full border border-slate">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-mono text-xs text-ivory/60">System Operational</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// Render the application into the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
