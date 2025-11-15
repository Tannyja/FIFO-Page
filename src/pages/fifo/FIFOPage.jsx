// src/pages/fifo/FIFOPage.jsx

import React, { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

// ==================================================
//  Helper : แปลง CSV → array ของ page
//  - รองรับ "9,9,7,3,..." หรือขึ้นบรรทัดใหม่
//  - จำกัดสูงสุด 40 ค่า (เกินกว่านี้ตัดทิ้ง)
// ==================================================
function parseCsvToPages(text) {
  if (!text) return [];
  const nums = text
    .split(/[\n,;]/) // แยกด้วย , ; หรือ newline
    .map((t) => t.trim())
    .filter((t) => t !== '' && !Number.isNaN(Number(t)))
    .map((t) => Number(t));

  return nums.slice(0, 40); // จำกัดไม่เกิน 40 pages
}

// ==================================================
//  Helper : FIFO Algorithm
//  return { steps: [], totalFaults, totalHits }
//  steps = [{ step, page, frames: [...], isFault, usedIndex }]
// ==================================================
function runFifo(pages, frameCount) {
  const frames = Array(frameCount).fill(null);
  let pointer = 0;
  const steps = [];
  let faults = 0;
  let hits = 0;

  pages.forEach((page, index) => {
    const hitIndex = frames.indexOf(page);
    let isFault = false;
    let usedIndex = null;

    if (hitIndex === -1) {
      // page fault
      usedIndex = pointer;
      frames[pointer] = page;
      pointer = (pointer + 1) % frameCount;
      faults += 1;
      isFault = true;
    } else {
      // hit
      usedIndex = hitIndex;
      hits += 1;
    }

    steps.push({
      step: index + 1,
      page,
      frames: [...frames],
      isFault,
      usedIndex
    });
  });

  return {
    steps,
    totalFaults: faults,
    totalHits: hits
  };
}

// ==================================================
//  FIFO Premium Neon Dashboard + Grid Visualization
// ==================================================

const FIFOPage = () => {
  const [fileName, setFileName] = useState('');
  const [rawCsv, setRawCsv] = useState('');
  const [frames, setFrames] = useState(3);
  const [pages, setPages] = useState([]);
  const [result, setResult] = useState(null);

  // ---------- handle upload ----------
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const text = await file.text();
    setRawCsv(text);

    const parsedPages = parseCsvToPages(text);
    setPages(parsedPages);
    setResult(null); // reset เมื่อเปลี่ยนไฟล์
  };

  // ---------- handle run FIFO ----------
  const handleRun = () => {
    if (!rawCsv || pages.length === 0) {
      alert('กรุณาเลือกไฟล์ CSV จ้า');
      return;
    }

    if (pages.length > 40) {
      alert('ระบบรองรับได้สูงสุด 40 pages ต่อการจำลอง');
    }

    const res = runFifo(pages, frames);
    setResult(res);
  };

  const totalRequests = result && result.totalFaults + result.totalHits;

  const faultRate =
    result && totalRequests
      ? (result.totalFaults / totalRequests) * 100
      : 0;

  const hitRate =
    result && totalRequests
      ? (result.totalHits / totalRequests) * 100
      : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 0,
        background:
          'radial-gradient(circle at top left, #4f46e5 0, #020617 45%), radial-gradient(circle at bottom right, #0f766e 0, #020617 50%)',
        color: '#e5e7eb'
      }}
    >
      {/* กล่องกลางทั้งหน้า ให้มันไม่ชิดซ้ายขวาเกินไป */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: 0
        }}
      >
        {/* Title */}
        <Box mb={3}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.4,
              color: '#f9fafb',
              textShadow: '0 10px 35px rgba(15,23,42,0.9)'
            }}
          >
            FIFO Page Replacement
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: '#9ca3af'
            }}
          >
            อัปโหลดไฟล์ CSV ด้วยน้าบ→{' '}
            <strong>Run FIFO</strong> ไม่อัปไม่เห็นผลน้า
          </Typography>
        </Box>

        {/* Glass Control Card (3 กล่องใหม่ สวย ๆ บาลานซ์) */}
        <Card
          sx={{
            mb: 3,
            p: 3,
            borderRadius: '26px',
            border: '1px solid rgba(148, 163, 184, 0.4)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.99))',
            boxShadow:
              '0 26px 90px rgba(15,23,42,0.95), 0 0 0 1px rgba(148,163,184,0.35)',
            backdropFilter: 'blur(18px)'
          }}
        >
          <Grid container spacing={3} alignItems="stretch">
            {/* Upload CSV */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 2.2,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(17,24,39,0.98))',
                  boxShadow: '0 0 0 rgba(0,0,0,0):',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(148,163,184,0.4)'
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.4, color: '#e5e7eb', fontWeight: 700 }}
                  >
                    Upload CSV
                  </Typography>

                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: 'rgba(148,163,184,0.85)',
                      color: '#e5e7eb',
                      px: 3.5,
                      py: 1,
                      fontWeight: 600,
                      fontSize: 14,
                      background:
                        'radial-gradient(circle at top left, rgba(24,37,66,0.85), rgba(15,23,42,1))',
                      boxShadow: '0 12px 30px rgba(15,23,42,0.9)',
                      '&:hover': {
                        borderColor: '#a855f7',
                        background:
                          'radial-gradient(circle at top left, rgba(168,85,247,0.25), rgba(15,23,42,1))',
                        boxShadow: '0 18px 40px rgba(129,140,248,0.9)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    เลือกไฟล์ CSV
                    <input
                      hidden
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1.6,
                    color: fileName ? '#e5e7eb' : '#6b7280'
                  }}
                >
                  {fileName ||
                    'เลือกไฟล์มาแล้วอย่าลืมกด Run FIFO น้าบ'}
                </Typography>
              </Box>
            </Grid>

            {/* Frames Select */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 2.2,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(17,24,39,0.98))',
                  boxShadow: '0 18px 40px rgba(15,23,42,0.9)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(148,163,184,0.45)'
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.4, color: '#e5e7eb', fontWeight: 700 }}
                  >
                    Frames
                  </Typography>
                  <Select
                    size="small"
                    value={frames}
                    onChange={(e) => setFrames(Number(e.target.value))}
                    sx={{
                      width: '100%',
                      borderRadius: 999,
                      backgroundColor: 'rgba(15,23,42,0.9)',
                      color: '#e5e7eb',
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(148,163,184,0.85)',
                        borderWidth: 2
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#a855f7'
                      },
                      '& .MuiSelect-select': {
                        py: 1,
                        pl: 2,
                        pr: 3
                      }
                    }}
                  >
                    <MenuItem value={3}>3 Frames</MenuItem>
                    <MenuItem value={4}>4 Frames</MenuItem>
                    <MenuItem value={5}>5 Frames</MenuItem>
                    <MenuItem value={6}>6 Frames</MenuItem>
                    <MenuItem value={7}>7 Frames</MenuItem>
                    <MenuItem value={8}>8 Frames</MenuItem>
                  </Select>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ mt: 1.6, color: '#6b7280' }}
                >
                  เอากี่ Frame ก็กดเลือกเลยน้าบ
                </Typography>
              </Box>
            </Grid>

            {/* Run Button */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 2.2,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, rgba(24,24,49,0.98), rgba(30,64,175,0.9))',
                  boxShadow:
                    '0 24px 60px rgba(59,130,246,0.85), 0 0 40px rgba(236,72,153,0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(129,140,248,0.8)'
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.4,
                      color: '#e5e7eb',
                      fontWeight: 700
                    }}
                  >
                    Actions
                  </Typography>

                  <Button
                    onClick={handleRun}
                    variant="contained"
                    sx={{
                      width: '100%',
                      px: 6,
                      py: 1.4,
                      borderRadius: 999,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: 0.3,
                      boxShadow:
                        '0 26px 55px rgba(129,140,248,0.8), 0 0 40px rgba(236,72,153,0.7)',
                      background:
                        'radial-gradient(circle at 0% 0%, #f97316 0, transparent 40%), linear-gradient(135deg, #6366f1 0%, #a855f7 45%, #ec4899 100%)',
                      '&:hover': {
                        boxShadow:
                          '0 30px 70px rgba(129,140,248,1), 0 0 55px rgba(236,72,153,0.95)',
                        transform: 'translateY(-1.5px)'
                      }
                    }}
                  >
                    Run FIFO
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ mt: 1.6, color: '#e5e7eb' }}
                >
                  Run เลยจ้า
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Reference string preview (glass) */}
        <Card
          sx={{
            mb: 2,
            p: 2.5,
            borderRadius: '18px',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9))',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: '#e5e7eb' }}
          >
            Reference String
          </Typography>

          {pages.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              ยังไม่มีข้อมูลเลยง่ะ
            </Typography>
          ) : (
            <Stack
              direction="row"
              spacing={0.75}
              flexWrap="wrap"
              sx={{ maxHeight: 130, overflowY: 'auto' , pr: 1 }}
            >
              {pages.map((p, idx) => (
                <Chip
                  key={`${p}-${idx}`}
                  label={p}
                  size="small"
                  sx={{
                    mb: 0.75,
                    backgroundColor: 'rgba(56,189,248,0.16)',
                    color: '#38bdf8',
                    borderRadius: '999px',
                    fontSize: 12,
                    fontWeight: 500,
                    border: '1px solid rgba(56,189,248,0.5)'
                  }}
                />
              ))}
            </Stack>
          )}
        </Card>

        {/* ========= GRID SIMULATION ใต้ Reference String ========= */}
        <Card
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '18px',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.96))',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#e5e7eb' }}
            >
              FIFO Simulation Grid (Frames × Steps)
            </Typography>
            {result && (
              <Typography
                variant="caption"
                sx={{ color: '#9ca3af' }}
              >
                แถว = Frame | คอลัมน์ = Step | สีชมพู = Fault | สีเขียว = Hit
              </Typography>
            )}
          </Stack>

          {!result || !result.steps || result.steps.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              ยังไม่มีข้อมูลเลยง่ะ
            </Typography>
          ) : (
            <Box
              sx={{
                mt: 1,
                overflowX: 'auto',
                pb: 1
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'flex-end',
                  borderRadius: 3,
                  px: 1.5,
                  py: 1,
                  background:
                    'repeating-linear-gradient(0deg, rgba(31,41,55,0.9) 0, rgba(31,41,55,0.9) 26px, rgba(17,24,39,0.9) 26px, rgba(17,24,39,0.9) 27px)',
                  boxShadow: '0 16px 40px rgba(15,23,42,0.9)'
                }}
              >
                {/* Column per step */}
                {result.steps.map((s, idx) => (
                  <Box
                    key={s.step}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mr: 0.75,
                      animation: 'fadeInUp 0.35s ease-out',
                      animationDelay: `${idx * 40}ms`,
                      animationFillMode: 'backwards',
                      '@keyframes fadeInUp': {
                        from: { opacity: 0, transform: 'translateY(8px)' },
                        to: { opacity: 1, transform: 'translateY(0px)' }
                      }
                    }}
                  >
                    {/* page number on top */}
                    <Tooltip title={`Step ${s.step} : Page ${s.page}`}>
                      <Box
                        sx={{
                          mb: 0.5,
                          px: 0.8,
                          py: 0.3,
                          borderRadius: '999px',
                          fontSize: 11,
                          fontWeight: 600,
                          color: s.isFault ? '#fecaca' : '#bbf7d0',
                          backgroundColor: s.isFault
                            ? 'rgba(248,113,113,0.16)'
                            : 'rgba(34,197,94,0.16)',
                          border: `1px solid ${
                            s.isFault
                              ? 'rgba(248,113,113,0.7)'
                              : 'rgba(34,197,94,0.7)'
                          }`
                        }}
                      >
                        {s.page}
                      </Box>
                    </Tooltip>

                    {/* frame cells */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column-reverse'
                      }}
                    >
                      {s.frames.map((f, frameIndex) => {
                        const active = s.usedIndex === frameIndex && f != null;
                        return (
                          <Box
                            key={frameIndex}
                            sx={{
                              width: 40,
                              height: 26,
                              mb: 0.2,
                              borderRadius: 1,
                              border: '1px solid rgba(55,65,81,0.9)',
                              backgroundColor: f
                                ? 'rgba(17,24,39,0.9)'
                                : 'rgba(15,23,42,0.9)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              color: f ? '#e5e7eb' : '#4b5563',
                              boxShadow: active
                                ? `0 0 0 1px ${
                                    s.isFault
                                      ? 'rgba(248,113,113,0.85)'
                                      : 'rgba(34,197,94,0.85)'
                                  }, 0 0 16px ${
                                    s.isFault
                                      ? 'rgba(248,113,113,0.75)'
                                      : 'rgba(34,197,94,0.6)'
                                  }`
                                : 'none',
                              transform: active ? 'scale(1.02)' : 'scale(1)',
                              transition: 'all 0.18s ease-out'
                            }}
                          >
                            {f ?? ''}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Card>

        {/* Results Table */}
        <Card
          sx={{
            p: 0,
            borderRadius: '22px',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(17,24,39,0.98))',
            boxShadow: '0 28px 70px rgba(15, 23, 42, 1)',
            backdropFilter: 'blur(18px)'
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 2.5,
              pb: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#e5e7eb' }}
              >
                Results — FIFO Steps Table
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                ตารางลายละเอียดทุก Step 
              </Typography>
            </Box>

            {result && (
              <Stack direction="row" spacing={1.2}>
                <Chip
                  label={`Page Faults: ${result.totalFaults}`}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    backgroundColor: 'rgba(248,113,113,0.14)',
                    color: '#fecaca'
                  }}
                />
                <Chip
                  label={`Hits: ${result.totalHits}`}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    backgroundColor: 'rgba(34,197,94,0.16)',
                    color: '#bbf7d0'
                  }}
                />
                <Chip
                  label={`Hit Rate: ${hitRate.toFixed(1)}%`}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    backgroundColor: 'rgba(59,130,246,0.16)',
                    color: '#bfdbfe'
                  }}
                />
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: 'rgba(31,41,55,0.9)' }} />

          {!result || !result.steps || result.steps.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                ยังไม่มีข้อมูลเลยง้ะ
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#020617',
                        color: '#e5e7eb'
                      }}
                    >
                      Step
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#020617',
                        color: '#e5e7eb'
                      }}
                    >
                      Page
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#020617',
                        color: '#e5e7eb'
                      }}
                    >
                      Frames
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: '#020617',
                        color: '#e5e7eb'
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.steps.map((row) => (
                    <TableRow
                      key={row.step}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(15,23,42,0.96)'
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(17,24,39,0.96)'
                        }
                      }}
                    >
                      <TableCell sx={{ color: '#e5e7eb' }}>
                        {row.step}
                      </TableCell>
                      <TableCell sx={{ color: '#e5e7eb' }}>
                        {row.page}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75}>
                          {row.frames.map((f, idx) => {
                            const active = row.usedIndex === idx && f != null;
                            return (
                              <Chip
                                key={idx}
                                label={f ?? '-'}
                                size="small"
                                sx={{
                                  fontSize: 11,
                                  borderRadius: '999px',
                                  color: f ? '#e5e7eb' : '#4b5563',
                                  backgroundColor: f
                                    ? 'rgba(31,41,55,0.9)'
                                    : 'rgba(15,23,42,0.9)',
                                  border: active
                                    ? `1px solid ${
                                        row.isFault
                                          ? 'rgba(248,113,113,0.9)'
                                          : 'rgba(34,197,94,0.9)'
                                      }`
                                    : '1px solid rgba(55,65,81,0.9)'
                                }}
                              />
                            );
                          })}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {row.isFault ? (
                          <Chip
                            label="FAULT"
                            size="small"
                            sx={{
                              borderRadius: 999,
                              backgroundColor: 'rgba(248,113,113,0.16)',
                              color: '#fecaca',
                              fontWeight: 600
                            }}
                          />
                        ) : (
                          <Chip
                            label="HIT"
                            size="small"
                            sx={{
                              borderRadius: 999,
                              backgroundColor: 'rgba(34,197,94,0.14)',
                              color: '#bbf7d0',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default FIFOPage;