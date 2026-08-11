/**
 * Sanity Seed Script
 * ------------------
 * One-time (idempotent) script that pushes all hardcoded fallback content
 * into real Sanity documents — including uploading images.
 *
 * Usage:  npx tsx sanity/seed.ts
 * Requires SANITY_API_TOKEN with Editor permissions in .env.local
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local ──
const envPath = resolve(import.meta.dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌  Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ── Helpers ──
async function uploadImage(url: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } }> {
  console.log(`   ↳ uploading ${url.slice(0, 80)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buffer, { contentType: res.headers.get('content-type') || 'image/jpeg' });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
}

async function upsert(doc: Record<string, unknown>) {
  await client.createOrReplace(doc as any);
  console.log(`   ✅ ${doc._type} → ${doc._id}`);
}

// ── Data Sources ──

const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3_5-hJobPa2qrQJgAHuhIWG3f4_-8BHexA67QGWDm69m_GbQFTjrLYBQs2ObbWJzc0jpJ5cykFvvtLB1TAdwkaqIA19yPUCYh5KK899YbwRYNssDkMae8eKwgB0irLb7qEBO5Q_lYpNqC_GW5dOIQN3xcHdAI_6803FlqNwo3eE6Z2RlYzjTmOnPtizblwV8TVJ8WiLtDOgy3beOJkRrJr-AurUnhFYZpT-r09p9l25SmEPrGafdm7BSsskjfaFN5BtcBrGhjiNw5A';

const FOUNDER_PORTRAIT_URL =
  'https://images.unsplash.com/photo-1743254467058-517c4d321452?auto=format&fit=crop&w=900&q=80';

const FOUNDER_BG_URL =
  'https://images.unsplash.com/photo-1780672823738-2a8d15d79aaf?auto=format&fit=crop&w=700&q=80';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVqgEgOZ1BhY5OiM3KUdClVlhjYzIRn0ecQsyOdTAgsqi_AXVjP9I84IxlhBS3__zNeWzFJKpzZGhCXI6ecWWPqcU3Xc9vfjfUfMEC0kzStlA_KMSYZ47XnTN35h7qu8Aa795TLBTJT6lAW3B9j90V-4GmHO7ACLcENcuenRGWcDdNcL_5gGCDOzAAw_cPminplD2-Vs9Fq-ZsNpxKPIY8S82qw-Kl43FG3il7AJl-Xf_tNd7NRn-TlHZSE0FfeISrf-sNuWNFsGw';

const SERVICES = [
  { label: 'Comprehensive Eye Examination', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRxKqi_COhmdvKti4Bg7HSPSGmfZEPGFGG7XolKmiWlsWBxga1lYBwYWlf5hPAdjyQweDvs1FWuAJrZDQH6VRyZ7Y1_LtGnbG8moQJsqNzZWSX2bSat0eQOcmpFObabXy90BeOITvyROY3wNweGdMh74Lci684D8Mlju71IOTm4kgpNp7sfAxVdrJPdnsF6qK9iQ3wRUHyWyEkLHxJk9YyVz0YJSf2ftSBbdVsyJ25AVzp6J0WxA-cTkWMliSyJX0pmN91HGe2xw4pQ' },
  { label: 'Vision Testing & Eye Check-up', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDge5v39DaOp1R9OAkSE7aYqiIcAU6lw4IBqcBf6R8VhBVcIb5W7zt81SfZgl-4rr64NLEbtGxwSRKSGfPz7jbs444J97J8oGbdfEsurbD01y8u7TdalUJAqlXGeSQBMuJhlbvMqxPecbqgXgsRRtvZ81wRCqcJlTpZ_X-xrrKFkWvf5w3cYsovsoejD3CuGCJCshed5wUq7WfGMqI0MtqowrKT3oZYyRnPTkLKW2QdbOU9TskQlBotSASDwy4xjPtYr5hZj-D9ULA' },
  { label: 'Computer Vision Syndrome Assessment', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm60LrpmhBcifw8Ng70RULzlC70YZJXLL9n2amNmA5sm4gFAbK-lKs2CkOBq7Juk-f3mCzxrijEEMEILFhU9oqDfqQe04YJw0t61afSdrs1MY-nAkWq5ZzVENTndUSfXIacy9puRchZO5FksCjyFh_NSLGbshCj95-EX7edJdeIrksCa9VcVRahf-GqOS_Celd8OJMaXdHBGEbjh7yGL6XeKNW6qjrWh-jUL1zrKOAr5_75cEJLnordcJeh-ZLnsrzyF6jS3GoPBcbOw' },
  { label: 'Contact Lens Consultation & Fitting', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1_p-SS2s8Yp3ekSPLyEjQK_XKdwWBfYNAUGWRAJPlUfZrDX8ogqc_RyqAlt1KMuaMpv_yPnKoAgacVl830yzk_r0dMGOBZ91eQPHP7Wljrd9cbydk3g4vE_PMnVEC9nE8bIc58V19T8EN7A9aiT88GxrFFLneO3z68zj0KpW0DvbAppfxbPRUReG2blcI-n1V5YTPRXi9Mlbe3IDLN8oTIrIKxwnbrAsN8c0sOOKFT6bY5TV2pbOF2mjc_6M9gNU6WZI3j66_E6M' },
  { label: "Children's Eye Examination", src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9ea6NA9az1cns7OevU5FFJhDUwZHQVm9GumGkC-WC1Ub1Qf_eNFjn-8sIhQo_xoTSOxk7FyjFA4-E6I6Pvimv0vbozqCTjLqvg_9zAPNE-bcuxKkSYbhpkwYcMPNEH09wPUopI_KEgQDPTrxKXP5MGurSf5tA08167EmZcpdU9w80uRJJsmA6vHoIyRfOjMVNBUNgFB8lKm2iSk2LfUE4BrLgPY8Lo2mX2OxWApLmz33jKwJETlz9MR_DNqaHNSDIuuvToVfTsgHy6g' },
  { label: 'Prescription Glasses & Spectacles', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6CAyJ2a7SHcPzQg9oNWjb-Dd3noeN8kPg1NENlrkOxyIJMtQCSdYbiuLf7IjN1iFVHEwNA_f-CDa-ncb06gnFQ7m0PDYA2hkVQQ27y9UkpEa9zRypX4n56vBE9_OP4uGlGHscdvn3dgd0X637MDW18-u-6BgPD2Ok1tp9JXvVMfXGdWK7eVVicZN723EEykd6asPEMjtHl7iBeX_lUqRvkqGbhVD2R4afn_YtWJRh43YuljQRtY3Vf1Y1_dvSdzRvg7u45X56IxvFsQ' },
  { label: 'Eye Pressure Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhu8GtpD7M8eY9FenlqOmzM_p3wtHMZhIHKWt-2-X6gUIdVwjaKs0bdjvpWwEHCDoOaoKVl7wJTnd7Ctm2ULR1odl_seKw1GTpGHXreIXoYjDAXCEHPqYY6Y3d6apAD66u_Htsi_1u49VycjUJsk6iEBYqKhGHepfi76GQQ5Kd_zQ6cxeZWthr5Bu7EPVJtVMxwg_NI2vhBInShSQbUzOJfQVLg6R1Sv5z_iANTSEASq1XkSruqGWyWXMZGWg31axdxz3NHx4sS4' },
  { label: 'Diabetic Eye Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW9byBUV3l5-BoQ38tS8QdtSJ7gJ8e-Dgq1CtjxVT-36gi54cZsXTlSzzQaeQFw48mXiOfHjY96QzvnuMYec8mRbtTBvxAFB9wTh45mvhttD-H8t2R7uNkzAorKoYVkeKeRSUwe0YHdUeJsjnULOWdJeg15jwJnKp0vBZ7mnYgcpeIRYKlipJazcLwFRH5gCgd92trtwMUTSFEeetoYfD8lX6WX6PzdKXowXydoX5iazsQFqs9PFjSThTFI5kI4fPb0tMNOnSVr88' },
  { label: 'Dry Eye Evaluation & Treatment', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9fJze9weiIkJxiDrXshXzPrWeZn0MBqqb3S96pVCHosfTqA9w8M9PCrC3ikBxijQ7FMgb4PyZ5a9fbG6dOAv0rpqrVysC2F6EioqEM3NqSQDjXikrWUHg50Uu8l0W6od3HIM2spdSJWjWpz_78PAjppIymVE3iaFnbODSSGSc_aZRnoNy-A482VYxqp66d3ycf0YBlshkrJKLAJB2xjBldsvGrUVklcCAKb6sYmWvr5p7rtmJ74vQ7ksGaFGuJVZ0ZEZWI0u5bOo' },
  { label: 'Cataract Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHSRVaGupoygMvmr6ZfNFN28WptmOEDiJusQxBfCEaHsZNOJ4WKXKclAo1Dokwj931UjvN0x2RTBYgztkvyHr2LddVW8n_HaW5wXysVLbwnUU5hnL0aGMRIN9fH3DiLKkjF3gJuO-t_1PbftpskQfCvBs7yUUJJPpZjXftdwYBjzvX3eweVJCcz2BFLSQc6ylD65WK6KqjqNdx77A3dLE4dhZjwo015rvEjUhmolIoxcmecAnm14WcHyPm48Rdt7PUBfd3LmhYZI4' },
  { label: 'Retinal Examination', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpR9UfHVG5Y6eJ_2R8ork4Ei7ef_4TstmkJGkisb57reC4TJBbAMGZQ9-zjjeOJPe-9mMtb_YMBY-oMhVUWy8Mtz4nlbjertvPuGArNEJZuVN0-TknRFEMYDew6UVLGubWnpGGrQsvKZIqMboAghj35oFAZevljgHf21TNNmuM4_Vey0kP-AI_4jVzr1cr_c0kZhrkrvlvBbe5a2Ey6BcLekX9xysTfK_5ayBTVvF7xFtVhAtrtvArn8QHTGEVdNDAk5PPCsijmfidWg' },
  { label: 'Color Vision Testing', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjYhr6_M-T0gxXV0-8uc8PLothenH7qMKILhQhri8jb45sMoGPKK3SSToSa91nYlUCyvNTUcYuSiYjJJP72nc7G2QV875D_wgG3yd3TgyyeZYSRk7hc5ZTO_PnUfzew1cj0vS2tsrw-bxjfOBBd6TT7AMPL8Ixw_pxaJVf9Lgq5FQJIEZc2Kzsi36K48fNxdPKQAbRbnYK3jreYplO0WF5bWcKSo4KEd6eqCC4AUoWlxRawGVyK2zd8GwBFOyYgaZjwN5MaB3xCKg' },
  { label: 'Refraction Test for Prescription', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkTLgiV0LaWaIMNqUr3o-isbI3kHbh5aWX6ALERTFXl0h8fKONHk23suiE47tHqRO5y4ntTcSYBMiehT8HTb6OA-iJWu31KdL91bA52uKFReIiqVOrO_oS5bDQbD2HCeuk0fkMymCfaBdIbmdpi1S2bYKOARofZAByLWTOeJoxh5PhEOAc3m2Kek1QT9RFaOxwVCAQQQt4b6G2qoAarHc0kOBjM59O45dUnxJydXfTX6VT5JVYD6QgQBvgidobJX2tLftDCY0QqdM' },
  { label: 'Eye Care Tips', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCglk769uGqm3dtzYgo_9zKrlItFtGgHvFyZLsG9MoVqUardPUrX2TZJEaoO8BWzP6sE6HDpSyGiexbo0r9GHwR-_jiCSj9HIjZ8XJnvVez8iP8RKS8H3zv7HARRpyJkJ_10rTMs3E6zdKbKFvy141k1KvQ4hL1SXnYPnEYzi1OFYqLOfUyXQEo17m3YGkNv70Dv1ZUHJqqItmivMgTkqY4cRBwwLwkCir1Nw1yZIHAvxcMriBHqM8ec085SiMZ3_0Dse0yM7ofgFYPXg' },
  { label: 'Vision Care Advice', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMXEtJ-N1g-SqZz8j2kCMTFw6R6OzTU2cmHjXdzPOE1tQSYZSNGBMdg7lsJaMVUnJJOXtCsySCOv5opaoDMRUsJdR3yub0IE35Ig3mgapzTKTH0mDrfr9bXDLqIYBaahytXHQQT0wMLCWihv2k--DQx28bGu21pY8NxfugpnV6Bs9PNRLVe9rBEI_ZKQcJfjaY19oqqN8-ajwOhSeHY9_s2ejpEwm3ev129RGC0ltxnCwdvswzslIE-MZgdzRic9h1wYkZN1NrjqE' },
];

const FRAMES = [
  { code: 'FR-01', label: "Men's Frames", size: 'large', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3OuQW3Z0SKD07Cbm2hw4VwkKj4cGMoDO_vwvmbpjb_TqB323MnUgAB2KuXTECogj4bgyMf-4j9iPE010CBhRSU1u9-labOOzaqMRNKjaCy9wvjlR2BDaFfPCMBR1vOIpk-JxItA5dCk9gpmozaibftcDkDMEFYTusjsDvnLJMHleSwDalj7z-pWuYDDjiJCWg_OQS1mIomsDBuN2QZU9VqgB6S592uls37lgjONVrAF-nfw53y6-lp4TGj-ZDy9jxylONHA5gnrM' },
  { code: 'FR-02', label: "Women's Frames", size: 'large', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuComcTt9bg-PZaLgroCnNWxWPpc6HMeRF4qm3Hb32qWyqRYUPtvbWAX6wSNy9m4_Fxv0sLN5RM7A-5b0xeQAKyq5nRCZF3nsTi9dA98oyy0W_3LL2i_Tjy_0fiBS-PMNCvMJiZMybK3DhntcOicOlpqJGoo2M7W-RM-fwAkP97rDD749o3We18MuHkloUz06A-qsCuNirnO8W-WbBSqYsPWyy56VxopUEz7uZ2yrNPbryEtX8uXxJqhNeq9mBASHHur2_MJMjJywkM' },
  { code: 'FR-03', label: "Kids' Frames", size: 'small', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3OuQW3Z0SKD07Cbm2hw4VwkKj4cGMoDO_vwvmbpjb_TqB323MnUgAB2KuXTECogj4bgyMf-4j9iPE010CBhRSU1u9-labOOzaqMRNKjaCy9wvjlR2BDaFfPCMBR1vOIpk-JxItA5dCk9gpmozaibftcDkDMEFYTusjsDvnLJMHleSwDalj7z-pWuYDDjiJCWg_OQS1mIomsDBuN2QZU9VqgB6S592uls37lgjONVrAF-nfw53y6-lp4TGj-ZDy9jxylONHA5gnrM' },
  { code: 'FR-04', label: 'Premium Frames', size: 'small', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCd8XRblEjcX3szwCwF98jc1aPh_09obmIovnGNn-JtGOFYvbpzvwFGvCFPd0UO7-9MvHuFPgkXSWVvPGQwwJNXTzo-CEEelV51JcrQgyDJTwMCIbq6kXCLDUxgUbaltv44EWkIJVGb4AciT-_esSBETAB1dWRUPFa0NvlAyOuZptwlh6YFEG1c2CeICYFhL2Wg6yYCU30s7quxDpuz2cXCcSrJLVEtnsC6l3Vec4-D7mOI5aYEdB311cVS2IeL4x6aGT8_mrvZKA' },
  { code: 'FR-05', label: 'Sports Frames', size: 'small', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHU_UJZigYA6SvOS1ukCxAmOr9FdFMhe_aABCUxqacUxX5gN0xSx7s9rKxhm73nspl-w-HnoN8KdhJrlOo4ERcAeG0PtXe1Bk-j_0WYb9yLerc2187LaOgppY2Do5HPsPpvpbRW_5orivo_V06Hk-kqED8VTZF-xC-cetuGuqkyEM9-uybHYytcylLqlyGp7QDs3BmlOt4_Uyq9vvosnYMLI5P6URTbgWIRu0O9ZsA-4QorAE3g8FvtnBorfQygtq63PbcfrlDnb4' },
  { code: 'FR-06', label: 'Rimless Frames', size: 'small', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpJAmvER8EdZEijg-uh0vdex7cfpKGshvZvY-7nyKk86blrDR0zRBgRZR2BNXQxY-7q0FDYX8Xd2uZoJ_FKiNgRKbmC05ANaVYmBzpHIPIdIl50D_xppPbekICVvcgVGckcnYG9IXbxi_rKTX-43Madqce30JYXvsIJg_65d0wxiBoL2bgYsZwxYxI_R0sqEe3iLv9ij1q9aagyLP498Yqqu6BGahPPI6-k99JIadeXYbAmPRpEKvE67yc2bnho7uYfTWqwxzIWA4' },
  { code: 'FR-07', label: 'Full-Rim', size: 'small', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3OuQW3Z0SKD07Cbm2hw4VwkKj4cGMoDO_vwvmbpjb_TqB323MnUgAB2KuXTECogj4bgyMf-4j9iPE010CBhRSU1u9-labOOzaqMRNKjaCy9wvjlR2BDaFfPCMBR1vOIpk-JxItA5dCk9gpmozaibftcDkDMEFYTusjsDvnLJMHleSwDalj7z-pWuYDDjiJCWg_OQS1mIomsDBuN2QZU9VqgB6S592uls37lgjONVrAF-nfw53y6-lp4TGj-ZDy9jxylONHA5gnrM' },
];

const LENSES = [
  { code: 'LN-01', label: 'Anti-Reflective', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9L5-8Wa_cdQLX_fJCzOSQ6QsGYohCD8x2GFIgrV-xx8EQ8e3zDldFbZz7OoCkaiRwldg66O8lISfjlD_d51OTADiV320-mZpv0uHsu5LWi-EU3EZqOg6FUeoO_leqtYjPEyyk0OoFuxETi1nCSo4d9qQjTyJ4IAUYEZpwBKbf7lG_nvOStq5X41lovXsMwz5AQ2i3u1CXVsxthYVn_QDmgwpD4kjJLRvH5vGdOwS9hV2D9gf4U9abMRjZ9Q5edc4WTcOKcN6ffG0' },
  { code: 'LN-02', label: 'Blue Light Block', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtVShbQ6qdSju1X9ENcyLzt_qsb4tY8FxK0fj4QyTpbXdtGqarCxLG4BWXlkZEEL6VC5VNlupRSpaNINdJgOJpk--4khtgshmkUZD2-QjQlgC0c9cqSO_GZvum5TliHkjEmtATeeyWzv1_8ZuiCEkFMM5eCqZ3Nm51D_x_SYSTz_8GMrNqjte0Uq1puCZQ5lM4nJY2o-P7buOwhsZqjV9sFeHTOEY7JeaIo9IhFJMdQVnB8sxcR_2jUV32S-SwbMHivmVOl6WsxM' },
  { code: 'LN-03', label: 'Progressives', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk8-4mIBNvPM6E-y6Sws05i3TkZwM0bpSZgB0RubXHQ4lHVztFDmwHHJfbW-JhSWCHKAHWvic9X092dPkhU47kXoJ28u37YP8PnJXNp22u-WnAgg721cnHatkpOJgCmcI35pCrJBMUQWmUzvtCXrXE77VdXiFxTjh6hrDjxKvNCMx6o4b0ICFYwn3q1kJBC_jqWK6iupXgg1R6fsTSQ7OnLg-1js3W5qR00sXGPU8v5cwQ1jwkhj9DABENCOYDKaU_4JoXmY8zA8o' },
  { code: 'LN-04', label: 'Transitions®', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxc6DnjbV-rPY8ZSrxtKVV89_PYKSrwbhJ-bOovBVf7b9HIH193Jx7BxVbmh1YupU19gnVoYbDTlJhtK8EL4CA8YFHnAqtA-krjuHBrVfSRAa_dBTWCZPGE80mvDlLNml_RG7CmUfJvrhpxXgCllsNPONCTCPYe3LC0Uxxb1j2JMYbgTvw9Nbdwi6i02H46s-9Ag06u4oL9gHsIj1gh6kcLhAQUduJrAFm7O0m_2spRV5u_b2k2WQjW3h9QLLd8WGOGRP_caY4130' },
  { code: 'LN-05', label: 'High-Index', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ28mDicjLEBBf65tqCXTKJiuGbzYcfoPpwDVQTcXo9OhCFH93yZaDm0wAA1BdMhpYFq6ocZCaGCchqd2xKgpUPkoFn0kIqAMSldOnAl2W17QQkeb-fepYTufUZUUDn02CeYrioVMcFAicVgNOdEBoh9rzi8qbzJ07UMOCLK1b9pXFVo2BwbWgcSSgXqAZaRbo8SgSBNDt7PCgRQ-B0lbR2ae2U5RNdS_8x76cMyFks2516AGWCwYimBIvlLdtmN9Mt0Exz3bX4ng' },
  { code: 'LN-06', label: 'Polycarbonate', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dtf7KNXT4gfEaBtHu5PbqVC-JjdLz1dSYOJ3VAa_exn0EEz8ohUFEsfll78efa1L2QD1uOjJG5_kQigPRdbZCeg8PUaa0_vEVB24dw6NlrRYRpkICPfjrSMlTPo5a03opOQ8hmnmSSuAB0IK9av3iySD7knO5yYSiWckj8mqK2sPibf3ODiZ6JQNs6pZUbQtcmywemM6T9gciGD3_G1t1qcMM7C6v7vcbO0jWi1GveUFmBvMkmIMzhkfwQuQte47b7E4ERM_bN4' },
  { code: 'LN-07', label: 'DriveWear', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcthN0chde77HnZY77EXAYrvG8ZWAYdkVSaZMsAht1wAlAU2JPps0w-kzRRM8HySpzikPzO36hFm7Hppu5-DkxV4Kj0b6xQChtBA6xc8x74-5GUqPD-fk2qnRHusvEd3e_B8oJXyUyZeqjCYAYgN4uEItCQOLrz1OrZJJ8AzeQR5dnJ5Z5xqVvOFQ-pMUJTkJglvG1_ITGyBXi4wkq4eChdvWHRX8Pqave8GIm-Fl6l7n_fOllSjyxE958EPL2wW_tspHUibuxqQU' },
  { code: 'LN-08', label: 'Contact Lenses', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP0VX3LOOGAuBSowl69VoCPICjaLc1XVRWqit_EIZhVFWiTCA7NHEt1am2fdtsNNmUet3Z4mojAJnXe8HtXykpVnI33gSNqIn6kKBg5torGrDxz2GP72hEzlyD4r-DvqK34ViFtlQHIh9Ll2YeG20apPohS9wk6CLFulwx-DGqPIaNtyrAGKtsbHTF6u8HnVr0lKSdm3DKzVGhGeE0lmR09AnyaOTlXSLT3Efhj_GZzLZuIHYCgLHIjU4IeYquGX2iJ2x2KfkgxCo' },
];

const CONTACT_LENSES = [
  { code: 'CL-01', label: 'Daily Disposable', description: 'Wear once and throw away.', icon: 'calendar_today', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCc7bIHgSLKLlfuQs4sbZJ7EkP-RxecmAcUPg7shnUErQUDk2IVEEaOWCnKhDQIfM3TqqpmqddkAra7cZd547eqBXzGJ7nuhFRLZmwu39I-mum4EpuQUVDekFnPcDBDOx0hPV_UyKCPjhk8QF_rrzWz_2is06MzhMt2KUFsi2VMs5oKIZl56z4yGFuccG5K6a-LddW2kJ9wkMyCUFAsTNAbZXdkqO69vdEwbuCzIOpdAns3hrFuBCrnHcGhPvZCF0ytWTEL4tQZ3c' },
  { code: 'CL-02', label: 'Monthly Lenses', description: 'Wear daily and replace every month with proper cleaning.', icon: 'sync', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB37rNmWILNrmMmoNPxfaXUGaT1VAawuXYGEjtIzakAoWPv49py0P75Ol94K4Aym-h7yVCAfTGBFbSgGHy_YuvxlnVzOkEkuvpqb9lcRqKbH9M5j2ataRFY_WKf4xpJYTDEYf01oNfXjvJ_sKLTeYptDSRT1L0DkTjyxHL3UDEON22rgBdu68DtDpDEO3TN_KALURUWExpeNOO4TVWJPvJGaKzp7-qLD_X2AB-5YJ1GKNYIiMJ2TmiBr5B5STEZLHcCmXNZRs8sIr8' },
  { code: 'CL-03', label: 'Toric Lenses', description: 'Designed for astigmatism.', icon: 'adjust', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCj_gJpHE-8P5Q8Dw072aMOCRoQDybQJZjOICUmDX0boPMH3ottbieBLQ0Nsk_iIzxEHDrlJ6JBEYiADsB4-LDps4SKSLAp2nxQCcUBDdLdVJOLSAorodFV7PS4SBie5aOtZSRh4yyZqBwX3mALmjDSbOmMG-_t10jDzyN-i7WpQ09i5XJav3Ot_dea-Ir0yCGOYmg-GLcvLmptBXHb2YbdJfj_tX43JCSP6VM4_fDDLCd0VBUCgOgwW4DwJ7Jvw9diCMYogMggUo' },
  { code: 'CL-04', label: 'Multifocal Lenses', description: 'Help with both near and distance vision.', icon: 'layers', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5dsmON2uMM51GI3uBjnQ7fs7AF3AP8e4pLOExhENlZ5dd5XCiunqSt9lSoIr_nNRVa4x_USfRXnsV3_2WJCLt9qjisNQ5wQqFRPsxT5qFv2D9wPc09bdjGbErlAOJtFmVADc_0gONk3okB-dDNE5sLS0Lgx5C0yhdPczpSNTIRkWgyx_2QkeH5Fj4s_vdLedBlSPeKVe279IM9juxK-lSYIddSdNKmOWRkMrfbZBtYlsFxMN4U462xTCWXAXfRogxTB-tBtQ6KI' },
];

const COLLECTIONS = [
  { icon: 'eyeglasses', title: 'Luxury Frames', description: 'High-end acetate and titanium frames crafted for everyday elegance and durability.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCd8XRblEjcX3szwCwF98jc1aPh_09obmIovnGNn-JtGOFYvbpzvwFGvCFPd0UO7-9MvHuFPgkXSWVvPGQwwJNXTzo-CEEelV51JcrQgyDJTwMCIbq6kXCLDUxgUbaltv44EWkIJVGb4AciT-_esSBETAB1dWRUPFa0NvlAyOuZptwlh6YFEG1c2CeICYFhL2Wg6yYCU30s7quxDpuz2cXCcSrJLVEtnsC6l3Vec4-D7mOI5aYEdB311cVS2IeL4x6aGT8_mrvZKA' },
  { icon: 'lens', title: 'Precision Lenses', description: 'Advanced optical technology for ultimate clarity, including progressive and digital strain options.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyx-KdNuLa_V2nflbqgat5OZsY3CJwPAe0IKMJQR9XZa4cPEJ1v5XL0Vwlqpq5v4qUD1FkHVdmKfvKGeU5ZZtxqmbYmGSV_duqlLvkLKNbUTiIkfnUOM0YVH1flJ7NrZHZrLzW_hIBl2Ml54ZSXm0xxF0cJo0pmafAOIPmYVLQrELzjBEzoIrt04KpMUlLf9cH3AOdMx03HjyNjAc4gZom3faeaVkLFRpOkAoEY4sPOq6U7DAV6b7QqOh5loJHxIHYfKkLAjICdjIFrw' },
  { icon: 'face', title: 'Studio Fitting', description: 'Expert personalized service ensuring your frames fit perfectly and comfortably for daily wear.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgpTjNKuJWmyjck6RS_OTHD-VN_o4ilzpc3WwGm8jXij2zN4sYKSDR9bLtIaP1dz1UmbM-PNOK4RjdATEffjntwaCE55GSfRID018WluM2DCrogYCoJ-f5-DwDLcLxQAXfaxdKJ3SiRNL2D0JaUniain0iEzsi0K9WF-Di7bjdSTLt_ueBjdHH1camn4ZlfGk9NDXj1rwPzNTl4PH9E_asex9cr5th791h6oPttVKIr04_UBR5r2ao6pHTSLR8cDBG0FEVXvrMa0' },
  { icon: 'workspace_premium', title: 'Designer Labels', description: 'Curated international brands offering the latest trends in eyewear fashion.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfA1OD-7IRDqYAXzlqz0h2wCZAm3abyTG6lkXxwfh42Ng4vd-JwOx0bhLPJLNt7vuHFQQFDfHI3KugtGSYBWtdk_Yhm3XhxVArv6BU9oPq4-MI0zBEXaSiygjVDH0DUkwICF1I8IYitAJvuckd1FoF-6e_Okq7j91cNw9tNkaCvEMiJx310HiriP_G-geGYNu_s9Z4pVsru4EWMYHADIbuKk-5GIM89fLTPi7Gf_teAMLSJ2grWazlmvir0SW8kiswnp0N41J83tM' },
  { icon: 'visibility', title: 'Contact Care', description: 'Specialized lens fitting and care solutions for a seamless alternative to frames.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbBv529DKhjPJ8pmmsgMjlrtZyryiMyk0LVl1Pm9hNyosLZYkokxjV96rKx9K4TBQIWlhRSVL-ncurTTl1FBPdB6EG16JrHSjhOKYcEbVeqiB65j7Hjjz7CamZkTKZqW-fKQ6ev3cwYBEd4e23FAjtYx4jpxytge5j6DYyO5eLxmGQj8SzgLc8OOwWaMf8aSNsVr_gglYyX64W4Bckj5IaR9XS5UwJHGXUNowTog09H8fLBIAHlfsjkSRerkZIoI3GhGNTdZ7shk' },
];

const TESTIMONIALS = [
  { name: 'Briana Patton', role: 'Creative Director', quote: "The level of clinical detail here is unmatched. I've never had an eye exam that felt this thorough, and the frames I picked are a total conversation starter.", src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpZn_KQktoKrqT39mGidjH9ZXQWk8ANwTjcCsckVvkfR_EQ-i5Zsz3dXJ3d_wUdMpUYQxQWI5_MQ-TQGsl4qvsucSZmguoMijEp3QF2bPJnINf5Sh4wrewD3SbysuOE9tWvldgMknaDDM-sQRpqeN64-oA-57iIxSpB9xClPT4yfS65NGhXGuGsvpvvtWlze5vtraz_1vIFKz-xPITo52Vpb3qL7QyAvGWtwM6gd8Mg5YJHekbsXP7lrXCtCVhDTxxzabdcTeZfBE' },
  { name: 'Bilal Ahmed', role: 'Software Engineer', quote: 'Finding glasses that actually suit my face has always been a struggle until I came to Royal Opticals. Their curators have a real eye for style.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeXFKPIdBThlwGu2Yev3xvBiPN5Jwaba81hb_J_60GwlBw20bh1D1DkTVDEelhBWmQv_0hnNihmMjqNP5e0v0LVnL2l7bzP6p4jb_wiPaJFNhrvamBXdlktiW-hsltoEWLnJOUIjADxHAphStD2_Hqi1vIBBQCj7BwEbhTxOOxLaIn2Og-zttaXQrhgDlCbW-N5-gZLYgOTwJBIIo0nbglFDhZNHHFcuH6Sr33QDYJ9vpOhe6b7WP-QXuqiBn1S20TtxQk26W_ER8' },
  { name: 'Saman Malik', role: 'Teacher', quote: "Excellent service for my son's first screening. The optometrists were patient and kind. Highly recommended for family eye care.", src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYe_f0NkFnz3XFGwU-f-tanUMe0-tyZOR_g0wzRXKYQKivNvWOlP4VMnF0guw9ubZJa5auBAlQzRGFVX01cOseIm93ZA2_VozZxhHGi7Hpwv0ZejzOvArrCpu798uhT9nTfdLnQbP-X5RBv5HtUn7KfQ4_RtR1JiAnzqBbho2YTHOPW0LEqH5tc3gLN7lVxz2-5ZcEsvp6eCV-q2pMAxUcHfP4brQ3lDNWtAj34wHI-TQEg9RN6fvNKx0Bs7NVPl12-V9dLdT1qeQ' },
  { name: 'Omar Raza', role: 'Data Analyst', quote: 'The digital strain therapy has completely changed how I work. My headaches are gone, and the new lenses are incredibly comfortable for long screen hours.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzu4wbcWfWcwna4PwZZ2EmnEBLeqkWnFHY_dFDkhATF6POnbgYxSJUxkKpOTGxjEX6X8xxKnLdH4Pl09wFdZeRyI4X0zUppgwwDAyLm3-1rRFYwh-oyemBKvXKVk6dJboZEW-2zFs1kp_3VRDGjsQj_4YRwxW228O0bwkg_zvMgCW1jzfp_0BAf5oHW5rYDavVDu9n31rvGYMn9WdRQh7inptDnLrlF6j2v25QMLoWKha9tCTJp07giu6sVdSdlb0xUuC2OVXrDXc' },
  { name: 'Zainab Hussain', role: 'Architect', quote: "A beautifully designed space with equipment I've never seen before. The entire process felt like a premium experience rather than a regular check-up.", src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ktPYp1ymVW5Z0RN5FIc62y3wdiOWc2HLJ7YLS_afBZPFTTfIyAeCpAmyu5709f-u6iG1lUNYo_19d34Xtyn2swY-2oi9uX2yzmBEYxj0z2gvmIT9i6Mws4H3JQn4ZI1nhOaVcWyYK9On6jFgixlcWF58CwHKen950O3Px1iYmmnPe_kMfZzvuYztGbElzieKVM2zJLjljKzKmwn0haZTnJjRfKrXoPZGyNCS3zHTgCfpuVsX--39Rd60m6KcTyYem9j1UKIRRj0' },
  { name: 'Aliza Khan', role: 'Medical Student', quote: 'Their contact lens fitting was so precise. I used to struggle with dry eyes, but the new material they recommended has been an absolute game changer.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRsQ4ixJ0DPba3GCuq4j2AkpeEy11hqpTK5vIyp1ISPpdekMo9W0jFYdmvkHnDN3txhLz14DlHdZGW4f5XWuKxFozcZzks-ub5Wzh6VRTscFH3Y7Lw5IT2ZtozwOy2tqZnLOyECZyaaC73ujAJ9Bq3NjZKJ22Ze_3YwLbbWqnTwaekjBQP6byIRGdrJ6lfm5hChDrVdtQe3dE8gRNmHnw8BaQhzZ9-Z2BTLILtPEGMogjvSHAxGWB_Bp4eMIU_3-vTfc3_VmOESrk' },
  { name: 'Farhan Siddiqui', role: 'Marketing Director', quote: 'From the moment you walk in, the service is impeccable. They helped me find the perfect designer frames that I absolutely adore.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_vDGOesYYssRu5rbtV5_1W4D_ZCyAoUOXw3k76TGzeUCVNvFl6vdEzRw-5VXPUsuv2O70Ss37MoDMxuRDKs0xfsE2s909xoDY8iLhM4UGEqEgvZcLzY8eeGc--uaMAAIy-kU-lhmp4NewIAYuSr8dv_H1z12YB7qE9_naJ3F_YMeUl0RMiprvAjU6l__2Gpj80CiOXRmU2VEspuyrSGYgngQT17Fvf9cXUqPe8kusIuBi1wvUzWlC7ve5J3BuMk0MkLMWZwhvHZo' },
  { name: 'Sana Sheikh', role: 'Finance Consultant', quote: 'Highly professional and deeply knowledgeable staff. They caught a minor retinal issue early on during my standard check-up.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYXch-ZSbSqjcLhZZZ95XEzXvVaiPWMhf7FGtE_cuU8eQm4NsIxBMMEw1kMMwsH7Wf63i8rZN9oo7POxiRlx7r14rPfz-fNuXouys5z8R0VIu0RLC4a_RyIPDwoBYzr2FXABvZwL5vkNIx_NEIYxLeSykNPycVevyVt5XVHl6OrM8KztfWGyKHuRJqqKI2v0p2CaOu8XhtSXiunWWlRgvXb0NkU8q6rc6S88OuGVLsrxyr1dZ5Nmd6duYPOlZGSXC47NAStX6iaO8' },
  { name: 'Hassan Ali', role: 'Business Owner', quote: "The blend of medical luxury and top-tier clinical care makes this my go-to clinic. I won't trust my eyes with anyone else.", src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY06PHqA78LTLxad0rD1VKdV8Q0gQ4a_-QmZC6Ky3892B3MQM3hy6jt7D-T0k1jeNCrUkwSjrOs11Moszuy0T2kVvb1hLHRBJI1ubrR5xxjJ9j7DI1SXJWtxt7yEvn3v-ffT1MJjwdphARmIyH-llzbb4_GST1fI5Jlc6atWPnVl597F23oYzvPfGqBCHhVqwgcuUjHUbCDaw_HOEFcYOkb252e7cZFIHL158FD65hXomTdN-uFCgHDg0PqtuD1mmTlP_xPS1VKW0' },
];

const FAQS = [
  { q: 'How often should I get an eye examination?', a: 'We recommend an eye check-up once every year. If you have diabetes, wear glasses, or notice changes in your vision, you may need more frequent eye exams.' },
  { q: 'What are the signs that I need an eye test?', a: 'You should book an eye test if you experience blurred vision, headaches, eye strain, difficulty seeing at night, double vision, or frequent changes in your eyesight.' },
  { q: 'Do you provide computer vision or digital eye strain tests?', a: 'Yes. We evaluate symptoms caused by long hours of screen use and recommend the right lenses, glasses, or treatments to reduce eye strain and improve comfort.' },
  { q: 'Can children have their eyes checked?', a: 'Absolutely. Regular eye examinations help detect vision problems early, supporting healthy learning and development. We recommend routine eye check-ups for children.' },
  { q: 'How long does a comprehensive eye examination take?', a: 'A complete eye examination usually takes 20–40 minutes, depending on your eye health and whether additional tests are needed.' },
  { q: 'Do I need an appointment for an eye check-up?', a: 'Appointments are recommended to reduce waiting time, but walk-in patients are also welcome whenever possible.' },
];

// ── Main Seed ──
async function seed() {
  console.log('\n🌱  Seeding Sanity dataset...\n');

  // 1. Hero Section (singleton)
  console.log('🏠 Hero Section');
  const heroImage = await uploadImage(HERO_IMAGE_URL);
  await upsert({
    _id: 'heroSection',
    _type: 'heroSection',
    badgeText: 'Medical Excellence — Curated Style',
    heading: 'ROYAL OPTICALS',
    headingAccent: 'DEDICATED TO YOUR EYE HEALTH.',
    description:
      'For over 12 years, Royal Opticals has paired clinical precision with high-end editorial sophistication. Experience the luxury of seeing clearly.',
    primaryButtonText: 'Explore Services',
    primaryButtonLink: '#services',
    secondaryButtonText: 'View Catalog',
    secondaryButtonLink: '#full-catalog',
    heroImage,
    heroImageAlt: 'Optometrist holding luxury gold-rimmed glasses in a minimalist clinical setting',
    orbitText: 'BOOK VIA WHATSAPP • CLINICAL EXCELLENCE •',
  });

  // 2. Branding & Logo (singleton)
  console.log('\n🎨 Branding & Logo');
  const logo = await uploadImage(LOGO_URL);
  await upsert({
    _id: 'brandingSection',
    _type: 'brandingSection',
    clinicName: 'Royal Opticals',
    tagline: 'Where clinical excellence meets curated style.',
    logo,
    footerDescription:
      'Pairing clinical precision with everyday style — comprehensive eye exams, expert lens fitting, and frames chosen for how you actually see the world.',
  });

  // 3. Founder Section (singleton)
  console.log('\n👤 Founder Section');
  const founderPortrait = await uploadImage(FOUNDER_PORTRAIT_URL);
  const backgroundImage = await uploadImage(FOUNDER_BG_URL);
  await upsert({
    _id: 'founderSection',
    _type: 'founderSection',
    sectionLabel: 'Philosophy',
    headingLine1: 'THE FOUNDER',
    headingLine2: 'THE STANDARD',
    paragraph1:
      'Royal Opticals was forged from a singular vision: to create an uncompromising environment for high-performance individuals. We strip away the noise and focus entirely on the pure, unfiltered pursuit of visual clarity.',
    paragraph2:
      'Here, state-of-the-art biomechanics meet raw clinical expertise. Every square foot of our studio is meticulously designed to optimize your visual output.',
    founderPortrait,
    backgroundImage,
    yearsOfExcellence: 12,
    statLabel: 'Years of Excellence',
    secondStatValue: 'Elite',
    secondStatLabel: 'Clinical Equipment',
  });

  // 4. Studio Gallery (singleton)
  console.log('\n📸 Studio Gallery');
  const examRoomImage = await uploadImage('https://lh3.googleusercontent.com/aida-public/AB6AXuDy_f6n3tnXMXCGG1Zu3ZQ8XiAKa91wXzy0ZewduN_0C-E6VdSQMsP0UvhtT0JmnjVC2BkKCxjRZTmxxuXLboFIGd874qVrEXlpbIfTHNOixdb3Hoa4NogN60ueNk37LWGKDzVYVp50gSiee2ZnFnxBIabJecPf__oH6pR5f-q4O3TcHfmkaRwmqm38kpTC7BJx-C-yblovGcFr_ink5aJAZoamdhxUD87mbvAVhoPT1WOB8KIDsmGqp-R-oTwxS7FMuRuuLvhxE4s');
  const frameWallImage = await uploadImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCB7svLVrX9JHxmWyourdlvZayeZ1vCsOPiGtGMLQPHzSlOJLCzi4LOXy4U4kj0mbgZKm7Wz9O_7GhxS8TEyQtyLNT0oWHX-RJRRv7tmUwfy3f-LrB4IjIT2r1GFV_8l64dtcnB6lKTh-jfxgtHJgc9NVMWLF5MmTIrjfxc8D3ffrVcLE5G1jmGIYztXTHwDHPiyiCdtWTtlq4fw2IRKSGxydeg6mu6XLGl7tBq-hOGCInyUCoAJpp99X4ogEBUIPxhRkq3r0L-44o');
  const styleBarImage = await uploadImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBOjGBpnng1d155j8OV_jpMTMMk0nQjeTTZwrhtYHUwcNTjU2_r0cnFQX5REzCmnzzgQR6_HJ0IigjZJ-owKs7SZBFlQe2BQfnMdaC1kuEfsWSvuGcWtLpu5ucPVvHC7qk-O1laZxpfSUs07yV9Jozghz2G7sS_uLq1gaJM1BGLT6NX_4M-q6uxzLISC1vGVXj0qiGqophBQhX04d0H2tV2B0tpYFPFWweWB-ReJU_15P3NW_ipSa1uwSzfu5SwMeUhYxxWPxS7cJE');
  const fittingStudioImage = await uploadImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCDGQJVfFkNm130h_1lIt7IRcso_3_bSQKalmdRGtpmhKlzgoysv-G05scaRjKxwaHwm6aYOyUMFcvuE3EsBEezJ3MR6OdwfxWKhbkhCp-3PKOhIBsy6hyLzx5HKxkSU3k1Xj4fikpYwqcfcIdDNt7_a01AT9pNvfl39skToj_XK83NV42RFydPgZbJnxgIIsIWSktO0qh3bzC08NrEeZeOM1mnLrBN1DSwL0D-1gC5vZXdwLBqX4GnWNguXL2bEaw2NLjBcCkXBt0');
  await upsert({
    _id: 'gallerySection',
    _type: 'gallerySection',
    heading: 'Welcome to the studio',
    examRoomImage,
    frameWallImage,
    styleBarImage,
    fittingStudioImage,
  });

  // 5. Contact & Booking (singleton)
  console.log('\n📞 Contact & Booking');
  await upsert({
    _id: 'contactSection',
    _type: 'contactSection',
    heading: 'SECURE YOUR',
    headingAccent: 'SESSION',
    phone: '+919092919432',
    email: 'rizupapa123@gmail.com',
    whatsappNumber: '919092919432',
    address: 'WQ63+5QP, Villupuram Main Rd, Kottaimedu, Villianur, Puducherry 605110',
    mapEmbedUrl:
      'https://www.google.com/maps?q=WQ63%2B5QP%2C+Villupuram+Main+Rd%2C+Kottaimedu%2C+Villianur%2C+Puducherry+605110&output=embed',
    mapDirectionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=WQ63%2B5QP%2C+Villupuram+Main+Rd%2C+Kottaimedu%2C+Villianur%2C+Puducherry+605110',
  });

  // 5. Footer (singleton)
  console.log('\n📋 Footer');
  await upsert({
    _id: 'footerSection',
    _type: 'footerSection',
    copyrightText: '© 2024 Royal Opticals. Medical Excellence & Curated Style.',
    designPhilosophy: 'Design Philosophy: Medical Luxury',
    builtWith: 'Built with Precision',
    newsletterHeading: 'Newsletter',
    newsletterDescription: 'Receive curated style updates and eye care tips directly to your inbox.',
  });

  // 6. Services
  console.log('\n🩺 Services');
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const image = await uploadImage(s.src);
    await upsert({
      _id: `service-${i}`,
      _type: 'service',
      title: s.label,
      image,
      order: i + 1,
    });
  }

  // 7. Frames
  console.log('\n👓 Frames');
  for (let i = 0; i < FRAMES.length; i++) {
    const f = FRAMES[i];
    const image = await uploadImage(f.src);
    await upsert({
      _id: `frame-${f.code}`,
      _type: 'frame',
      code: f.code,
      label: f.label,
      size: f.size,
      image,
      order: i + 1,
    });
  }

  // 8. Lenses
  console.log('\n🔍 Lenses');
  for (let i = 0; i < LENSES.length; i++) {
    const l = LENSES[i];
    const image = await uploadImage(l.src);
    await upsert({
      _id: `lens-${l.code}`,
      _type: 'lens',
      code: l.code,
      label: l.label,
      image,
      order: i + 1,
    });
  }

  // 9. Contact Lenses
  console.log('\n👁️ Contact Lenses');
  for (let i = 0; i < CONTACT_LENSES.length; i++) {
    const cl = CONTACT_LENSES[i];
    const image = await uploadImage(cl.src);
    await upsert({
      _id: `contactLens-${cl.code}`,
      _type: 'contactLensProduct',
      code: cl.code,
      label: cl.label,
      description: cl.description,
      icon: cl.icon,
      image,
      order: i + 1,
    });
  }

  // 10. Curated Collections
  console.log('\n✨ Collections');
  for (let i = 0; i < COLLECTIONS.length; i++) {
    const c = COLLECTIONS[i];
    const image = await uploadImage(c.src);
    await upsert({
      _id: `collection-${i}`,
      _type: 'collectionItem',
      icon: c.icon,
      title: c.title,
      description: c.description,
      image,
      order: i + 1,
    });
  }

  // 11. Testimonials
  console.log('\n💬 Testimonials');
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    const photo = await uploadImage(t.src);
    await upsert({
      _id: `testimonial-${i}`,
      _type: 'testimonial',
      name: t.name,
      role: t.role,
      quote: t.quote,
      photo,
      order: i + 1,
    });
  }

  // 12. FAQs
  console.log('\n❓ FAQs');
  for (let i = 0; i < FAQS.length; i++) {
    const f = FAQS[i];
    await upsert({
      _id: `faq-${i}`,
      _type: 'faqItem',
      question: f.q,
      answer: f.a,
      order: i + 1,
    });
  }

  console.log('\n✅  Seed complete! Open /studio to verify.\n');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
