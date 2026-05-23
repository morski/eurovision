import { useState, useEffect } from "react";
import {
    Alert, Box, Button, Chip, Container, FormControl,
    InputLabel, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography
} from "@mui/material";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StyledButton from "../shared/StyledButton/StyledButton";
import AdminService from "../../services/admin.service";
import { useGetActiveEvent } from "../../hooks/useEvents";
import { authHeader } from "../../services/auth-header";
import IParticipant from "../../types/participant.type";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

function SortableParticipant({ participant, index }: { participant: IParticipant; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: participant.id });
    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            sx={{
                display: "flex",
                alignItems: "center",
                p: "10px 14px",
                mb: 1,
                borderRadius: "8px",
                background: isDragging ? "rgba(100,215,214,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isDragging ? "var(--esc-cyan)" : "var(--esc-border)"}`,
                cursor: isDragging ? "grabbing" : "grab",
                transform: CSS.Transform.toString(transform),
                transition,
                userSelect: "none",
            }}
        >
            <Box {...listeners} sx={{ display: "flex", alignItems: "center", mr: 2, color: "var(--esc-muted)" }}>
                <DragIndicatorIcon />
            </Box>
            <Chip
                label={index + 1}
                size="small"
                sx={{
                    mr: 2, minWidth: "32px",
                    background: "var(--esc-cyan)", color: "#000",
                    fontFamily: "gotham-book", fontWeight: 700,
                }}
            />
            <Box>
                <Typography fontFamily="gotham-book" color="var(--esc-white)" fontWeight={700} fontSize="15px">
                    {participant.country?.name?.trim()}
                </Typography>
                <Typography fontFamily="gotham-book" color="var(--esc-muted)" fontSize="13px">
                    {participant.artist} &bull; {participant.song}
                </Typography>
            </Box>
        </Box>
    );
}

function Admin() {
    const [tab, setTab] = useState(0);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const { data: activeEvent } = useGetActiveEvent();

    // Countries state
    const [countries, setCountries] = useState<any[]>([]);
    const [countryName, setCountryName] = useState("");
    const [countryFlag, setCountryFlag] = useState("");

    // Event state
    const [eventName, setEventName] = useState("");
    const [eventYear, setEventYear] = useState("");
    const [eventCity, setEventCity] = useState("");
    const [eventCountryId, setEventCountryId] = useState("");
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [subCompName, setSubCompName] = useState("");
    const [subCompEventId, setSubCompEventId] = useState("");
    const [activeEventId, setActiveEventId] = useState("");

    // Participant state
    const [artist, setArtist] = useState("");
    const [song, setSong] = useState("");
    const [participantCountryId, setParticipantCountryId] = useState("");
    const [eventId, setEventId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedCountryName, setSelectedCountryName] = useState("");

    // Song order state
    const [selectedSubId, setSelectedSubId] = useState("");
    const [subCompetitions, setSubCompetitions] = useState<any[]>([]);
    const [orderedParticipants, setOrderedParticipants] = useState<IParticipant[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetch(BASE_URL + "api/eurovision/countries")
            .then(r => r.json())
            .then(setCountries)
            .catch(() => { });

        fetch(BASE_URL + "api/eurovision/events")
            .then(r => r.json())
            .then((data) => {
                setAllEvents(data);
                const active = data.find((e: any) => e.isActive);
                if (active) setActiveEventId(active.recordGuid);
            })
            .catch(() => { });

        if (activeEvent) {
            setEventId(activeEvent.id ?? "");
            fetch(`${BASE_URL}api/eurovision/subcompetitions/${activeEvent.year}`, {
                headers: authHeader()
            })
                .then(r => r.json())
                .then(setSubCompetitions)
                .catch(() => { });
        }
    }, [activeEvent]);

    useEffect(() => {
        if (!selectedSubId) return;
        fetch(`${BASE_URL}api/eurovision/subcompetition/byid/${selectedSubId}`, {
            headers: authHeader()
        })
            .then(r => r.json())
            .then(data => {
                setOrderedParticipants(
                    (data.participants ?? []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                );
            })
            .catch(err => console.error("Failed to load participants:", err));
    }, [selectedSubId]);

    const showFeedback = (msg: string, isError = false) => {
        if (isError) setError(msg);
        else setSuccess(msg);
        setTimeout(() => { setSuccess(""); setError(""); }, 4000);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setOrderedParticipants(prev => {
                const oldIndex = prev.findIndex(p => p.id === active.id);
                const newIndex = prev.findIndex(p => p.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleSaveOrder = async () => {
        if (!selectedSubId || !orderedParticipants.length)
            return showFeedback("No participants to save", true);

        const ids = orderedParticipants.map(p => p.id);
        const res = await AdminService.saveParticipantOrder(selectedSubId, ids);
        if (res.ok) showFeedback("Order saved successfully!");
        else showFeedback("Failed to save order", true);
    };

    const handleAddSubCompetition = async () => {
        if (!subCompName || !subCompEventId)
            return showFeedback("Please fill in all fields", true);
        const res = await AdminService.addSubCompetition(subCompName, subCompEventId);
        if (res.ok) {
            showFeedback("Show added successfully!");
            setSubCompName("");
            setSubCompEventId("");
        } else {
            showFeedback("Failed to add show", true);
        }
    };

    const handleSetActiveEvent = async () => {
        if (!activeEventId)
            return showFeedback("Please select an event", true);
        const res = await AdminService.setActiveEvent(activeEventId);
        if (res.ok) {
            showFeedback("Active event updated! Refresh the page to see changes.");
            // Clear cached active event so it reloads
            localStorage.removeItem("activeEvent");
        } else {
            showFeedback("Failed to update active event", true);
        }
    };

    const handleAddCountry = async () => {
        if (!countryName || !countryFlag) return showFeedback("Please fill in all fields", true);
        const res = await AdminService.addCountry(countryName, countryFlag);
        if (res.ok) {
            showFeedback("Country added successfully!");
            setCountryName(""); setCountryFlag("");
        } else {
            showFeedback("Failed to add country", true);
        }
    };

    const handleAddEvent = async () => {
        if (!eventName || !eventYear || !eventCity || !eventCountryId)
            return showFeedback("Please fill in all fields", true);
        const res = await AdminService.addEvent(eventName, eventYear, eventCity, eventCountryId);
        if (res.ok) {
            showFeedback("Event added successfully!");
            setEventName(""); setEventYear(""); setEventCity(""); setEventCountryId("");
        } else {
            showFeedback("Failed to add event", true);
        }
    };

    const handleAddParticipant = async () => {
        if (!artist || !song || !participantCountryId || !eventId)
            return showFeedback("Please fill in all fields", true);

        const res = await AdminService.addParticipant(artist, song, participantCountryId, eventId);
        if (!res.ok) return showFeedback("Failed to add participant", true);

        if (imageFile && selectedCountryName && activeEvent) {
            const formData = new FormData();
            formData.append("file", imageFile);
            const uploadRes = await fetch(
                `${BASE_URL}api/eurovision/admin/upload/${activeEvent.year}/${selectedCountryName}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: formData,
                }
            );
            if (!uploadRes.ok) return showFeedback("Participant added but image upload failed", true);
        }

        showFeedback("Participant added successfully!");
        setArtist(""); setSong(""); setParticipantCountryId("");
        setImageFile(null); setSelectedCountryName("");
    };

    const panelStyle = {
        borderRadius: "8px",
        background: "var(--esc-panel)",
        border: "1px solid var(--esc-border)",
        boxShadow: "var(--esc-shadow)",
        p: { xs: "18px", md: "32px" },
        width: "100%",
        position: "relative" as const,
        overflow: "hidden",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "6px",
            background: "linear-gradient(90deg, var(--esc-pink), var(--esc-cyan), var(--esc-yellow), var(--esc-red))",
        },
    };

    const inputStyle = {
        mb: 2,
        "& .MuiOutlinedInput-root": { color: "var(--esc-white)" },
        "& .MuiInputLabel-root": { color: "var(--esc-muted)" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--esc-border)" },
        "& .MuiSelect-icon": { color: "var(--esc-muted)" },
    };

    const selectMenuProps = {
        PaperProps: {
            sx: {
                background: "var(--esc-panel)",
                border: "1px solid var(--esc-border)",
                "& .MuiMenuItem-root": {
                    color: "var(--esc-white)",
                    fontFamily: "gotham-book",
                    "&:hover": { background: "rgba(255,255,255,0.08)" },
                    "&.Mui-selected": { background: "rgba(100,215,214,0.15)" },
                },
            },
        },
    };

    const sectionTitle = (text: string) => (
        <Typography fontFamily="gotham-book" color="var(--esc-white)" fontWeight={600} mb={2}>
            {text}
        </Typography>
    );

    return (
        <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: "16px" }}>
            <Box sx={panelStyle}>
                <Typography fontFamily="gotham-book" fontSize="28px" color="var(--esc-cyan)" fontWeight={700} textTransform="uppercase" mb={3}>
                    Admin Panel
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{
                        mb: 3,
                        "& .MuiTab-root": { color: "var(--esc-muted)", fontFamily: "gotham-book" },
                        "& .Mui-selected": { color: "var(--esc-cyan) !important" },
                        "& .MuiTabs-indicator": { backgroundColor: "var(--esc-cyan)" },
                    }}
                >
                    <Tab label="Add Participant" />
                    <Tab label="Add Country" />
                    <Tab label="Add Event" />
                    <Tab label="Song Order" />
                    <Tab label="Add Show" />
                    <Tab label="Active Event" />
                    
                </Tabs>

                {/* ADD PARTICIPANT */}
                {tab === 0 && (
                    <Stack spacing={0}>
                        {sectionTitle(`Add Participant to ${activeEvent ? `${activeEvent.name} (${activeEvent.year})` : "active event"}`)}
                        <TextField fullWidth label="Artist" value={artist} onChange={e => setArtist(e.target.value)} sx={inputStyle} />
                        <TextField fullWidth label="Song" value={song} onChange={e => setSong(e.target.value)} sx={inputStyle} />
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel shrink>Country</InputLabel>
                            <Select
                                value={participantCountryId ?? ""}
                                displayEmpty
                                label="Country"
                                onChange={e => {
                                    setParticipantCountryId(e.target.value);
                                    const selected = countries.find((c: any) => c.recordGuid === e.target.value);
                                    setSelectedCountryName(selected?.name?.trim() ?? "");
                                }}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value=""><em>Select country...</em></MenuItem>
                                {countries.map((c: any) => (
                                    <MenuItem key={c.recordGuid} value={c.recordGuid}>{c.name?.trim()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                            <Typography fontFamily="gotham-book" color="var(--esc-muted)" fontSize="12px" mb={1}>
                                Participant image — will be saved as{" "}
                                <span style={{ color: "var(--esc-cyan)" }}>
                                    {selectedCountryName
                                        ? `${selectedCountryName.toLowerCase().replace(" ", "_")}-hero.jpeg`
                                        : "countryname-hero.jpeg"}
                                </span>
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                    color: imageFile ? "var(--esc-cyan)" : "var(--esc-muted)",
                                    borderColor: imageFile ? "var(--esc-cyan)" : "var(--esc-border)",
                                    fontFamily: "gotham-book",
                                    "&:hover": { borderColor: "var(--esc-cyan)", color: "var(--esc-cyan)" },
                                }}
                            >
                                {imageFile ? imageFile.name : "Choose Image"}
                                <input type="file" accept="image/*" hidden onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                            </Button>
                        </Box>
                        <StyledButton onClick={handleAddParticipant}>Add Participant</StyledButton>
                    </Stack>
                )}

                {/* ADD COUNTRY */}
                {tab === 1 && (
                    <Stack spacing={0}>
                        {sectionTitle("Add a new country")}
                        <TextField fullWidth label="Country Name" value={countryName} onChange={e => setCountryName(e.target.value)} sx={inputStyle} />
                        <TextField fullWidth label="Flag (emoji or text)" placeholder="e.g. SE or Sweden" value={countryFlag} onChange={e => setCountryFlag(e.target.value)} sx={inputStyle} />
                        <StyledButton onClick={handleAddCountry}>Add Country</StyledButton>
                    </Stack>
                )}

                {/* ADD EVENT */}
                {tab === 2 && (
                    <Stack spacing={0}>
                        {sectionTitle("Add a new event")}
                        <TextField fullWidth label="Event Name" value={eventName} onChange={e => setEventName(e.target.value)} sx={inputStyle} />
                        <TextField fullWidth label="Year" value={eventYear} onChange={e => setEventYear(e.target.value)} sx={inputStyle} />
                        <TextField fullWidth label="City" value={eventCity} onChange={e => setEventCity(e.target.value)} sx={inputStyle} />
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel shrink>Host Country</InputLabel>
                            <Select
                                value={eventCountryId ?? ""}
                                displayEmpty
                                label="Host Country"
                                onChange={e => setEventCountryId(e.target.value)}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value=""><em>Select country...</em></MenuItem>
                                {countries.map((c: any) => (
                                    <MenuItem key={c.recordGuid} value={c.recordGuid}>{c.name?.trim()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <StyledButton onClick={handleAddEvent}>Add Event</StyledButton>
                    </Stack>
                )}

                {/* ADD SHOW */}
                {tab === 4 && (
                    <Stack spacing={0}>
                        {sectionTitle("Add a show to an event")}
                        <TextField
                            fullWidth
                            label="Show Name"
                            placeholder="e.g. Eurovision Semi-Final 1"
                            value={subCompName}
                            onChange={e => setSubCompName(e.target.value)}
                            sx={inputStyle}
                        />
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel shrink>Event</InputLabel>
                            <Select
                                value={subCompEventId ?? ""}
                                displayEmpty
                                label="Event"
                                onChange={e => setSubCompEventId(e.target.value)}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value=""><em>Select event...</em></MenuItem>
                                {allEvents.map((e: any) => (
                                    <MenuItem key={e.recordGuid} value={e.recordGuid}>
                                        {e.name} ({e.year})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <StyledButton onClick={handleAddSubCompetition}>Add Show</StyledButton>
                    </Stack>
                )}

                {/* ACTIVE EVENT */}
                {tab === 5 && (
                    <Stack spacing={0}>
                        {sectionTitle("Set the active event")}
                        <Typography fontFamily="gotham-book" color="var(--esc-muted)" fontSize="13px" mb={2}>
                            The active event is what all users see when they open the app.
                        </Typography>
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel shrink>Active Event</InputLabel>
                            <Select
                                value={activeEventId ?? ""}
                                displayEmpty
                                label="Active Event"
                                onChange={e => setActiveEventId(e.target.value)}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value=""><em>Select event...</em></MenuItem>
                                {allEvents.map((e: any) => (
                                    <MenuItem key={e.recordGuid} value={e.recordGuid}>
                                        {e.name} ({e.year}) {e.isActive ? "current" : ""}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <StyledButton onClick={handleSetActiveEvent}>Set as Active</StyledButton>
                    </Stack>
                )}
                {/* SONG ORDER */}
                {tab === 3 && (
                    <Stack spacing={0}>
                        {sectionTitle("Drag to set performance order")}
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel shrink>Show</InputLabel>
                            <Select
                                value={selectedSubId ?? ""}
                                displayEmpty
                                label="Show"
                                onChange={e => setSelectedSubId(e.target.value)}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value=""><em>Select show...</em></MenuItem>
                                {subCompetitions.map((s: any) => (
                                    <MenuItem key={s.recordGuid} value={s.recordGuid}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {orderedParticipants.length > 0 && (
                            <>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={orderedParticipants.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                        {orderedParticipants.map((p, i) => (
                                            <SortableParticipant key={p.id} participant={p} index={i} />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                                <Box sx={{ mt: 2 }}>
                                    <StyledButton onClick={handleSaveOrder}>Save Order</StyledButton>
                                </Box>
                            </>
                        )}

                        {selectedSubId !== "" && orderedParticipants.length === 0 && (
                            <Typography fontFamily="gotham-book" color="var(--esc-muted)" fontSize="14px">
                                No participants found for this show.
                            </Typography>
                        )}
                    </Stack>
                )}
            </Box>
        </Container>
    );
}

export default Admin;