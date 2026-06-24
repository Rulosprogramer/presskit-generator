import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { theme as pdfxTheme } from '../../lib/pdfx-theme';
import { isValidPdfImage } from '../../lib/pdfImageResolver';
import { getPdfTextEffectStyle } from '../../lib/textEffects.js';
import { abbreviateMetric } from '../../lib/formatMetric.js';
import { normalizeCoverFrame, coverFrameImageStyle } from '../../lib/coverFrame.js';

const FONT_SCALE = 0.88;

const styles = StyleSheet.create({
  page: {
    backgroundColor: pdfxTheme.colors.background,
    color: pdfxTheme.colors.foreground,
    fontFamily: pdfxTheme.typography.body.fontFamily,
    fontSize: pdfxTheme.typography.body.fontSize * FONT_SCALE,
    paddingTop: pdfxTheme.spacing.page.marginTop,
    paddingRight: pdfxTheme.spacing.page.marginRight,
    paddingBottom: pdfxTheme.spacing.page.marginBottom,
    paddingLeft: pdfxTheme.spacing.page.marginLeft,
  },
  coverPage: {
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    padding: 0,
    position: 'relative',
  },
  coverFrame: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  coverBackground: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  coverTop: {
    position: 'absolute',
    top: 34,
    left: 34,
    right: 34,
    alignItems: 'center',
  },
  coverArtist: {
    fontSize: 34 * FONT_SCALE,
    lineHeight: 1.05,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: '#ffffff',
    textAlign: 'center',
  },
  coverBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 34,
    alignItems: 'center',
  },
  coverPresskit: {
    fontSize: 13 * FONT_SCALE,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: '#ffffff',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: pdfxTheme.colors.border,
    paddingBottom: 10,
  },
  title: {
    fontSize: pdfxTheme.typography.heading.fontSize.h2 * FONT_SCALE,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: pdfxTheme.colors.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 10 * FONT_SCALE,
    color: pdfxTheme.colors.mutedForeground,
  },
  section: {
    marginTop: 14,
    gap: 6,
  },
  sectionTitle: {
    fontSize: pdfxTheme.typography.heading.fontSize.h5 * FONT_SCALE,
    fontWeight: pdfxTheme.primitives.fontWeights.semibold,
    color: pdfxTheme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  text: {
    lineHeight: 1.45,
  },
  pageTwo: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#0a0a12',
  },
  pageTwoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageTwoScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  pageTwoHeader: {
    position: 'absolute',
    top: 34,
    left: 48,
    right: 48,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageTwoCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 48,
    paddingRight: 48,
    paddingBottom: 130,
  },
  pageTwoKicker: {
    margin: 0,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 600,
  },
  pageTwoArtist: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 46 * FONT_SCALE,
    lineHeight: 1,
    fontWeight: 800,
    color: '#ffffff',
  },
  pageTwoInfo: {
    marginBottom: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 16 * FONT_SCALE,
    fontWeight: 600,
  },
  pageTwoBio: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15 * FONT_SCALE,
    lineHeight: 1.6,
    fontWeight: 400,
  },
  pageTwoVideoWrap: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageTwoVideoCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(0,0,0,0.62)',
    display: 'flex',
    flexDirection: 'column',
    width: 340,
  },
  pageTwoVideoThumb: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    backgroundColor: '#111827',
  },
  pageTwoVideoBody: {
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageTwoVideoKicker: {
    margin: 0,
    textAlign: 'center',
    color: '#67e8f9',
    fontSize: 12 * FONT_SCALE,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  pageTwoVideoTitle: {
    marginTop: 4,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 13 * FONT_SCALE,
    lineHeight: 1.15,
    fontWeight: 700,
  },
  pageTwoVideoLink: {
    marginTop: 8,
    textAlign: 'center',
    color: '#a7f3d0',
    fontSize: 15 * FONT_SCALE,
    textDecoration: 'underline',
    fontWeight: 600,
  },
  pageThree: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  pageThreeHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageThreeTitle: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  pageThreeBody: {
    flexDirection: 'row',
    gap: 18,
    flex: 1,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    minHeight: 0,
  },
  pageThreeImageCard: {
    width: '42%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 0,
  },
  pageThreeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageThreeFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12,
  },
  pageThreeCard: {
    width: '58%',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    minHeight: 0,
  },
  pageThreeLabel: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    fontSize: 15 * FONT_SCALE,
    fontWeight: 800,
  },
  pageThreeText: {
    marginTop: 10,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#f4f4f5',
    fontSize: 15 * FONT_SCALE,
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  pageThreeFooter: {
    height: 122,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    flexDirection: 'row',
    gap: 16,
  },
  pageThreeMetric: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(244,114,182,0.18)',
    backgroundColor: 'rgba(244,114,182,0.08)',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageThreeMetricLabel: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14 * FONT_SCALE,
    fontWeight: 800,
  },
  pageThreeMetricValue: {
    color: '#ffffff',
    fontSize: 28 * FONT_SCALE,
    lineHeight: 1,
    fontWeight: 900,
  },
  pageFour: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  pageFourHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageFourTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  pageFourBioSection: {
    paddingTop: 24,
    paddingRight: 32,
    paddingBottom: 24,
    paddingLeft: 32,
    flexShrink: 0,
    alignItems: 'center',
  },
  pageFourBioText: {
    color: '#f4f4f5',
    fontSize: 14 * FONT_SCALE,
    lineHeight: 1.55,
    textAlign: 'center',
  },
  pageFourImageSection: {
    flex: 1,
    position: 'relative',
  },
  pageFourImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageFourScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  pageFourFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12 * FONT_SCALE,
  },
  pageFourMilestoneOverlay: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    bottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pageFourMilestoneItem: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(103,232,249,0.22)',
    backgroundColor: 'rgba(10,10,18,0.72)',
    alignItems: 'center',
  },
  pageFourMilestoneText: {
    textAlign: 'center',
    color: '#f4f4f5',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  pageFive: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  pageFiveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageFiveScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  pageFiveHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(10,10,18,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageFiveTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  pageFiveArtistSub: {
    marginTop: 6,
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 18 * FONT_SCALE,
    lineHeight: 1.1,
    fontWeight: 800,
    textAlign: 'center',
  },
  pageFiveTextPanel: {
    position: 'absolute',
    top: 92,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 24,
    paddingRight: 44,
    paddingBottom: 36,
    paddingLeft: 44,
    justifyContent: 'flex-start',
  },
  pageFiveText: {
    color: '#ffffff',
    fontSize: 15 * FONT_SCALE,
    lineHeight: 1.7,
    textAlign: 'center',
  },
  releasePage: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  releaseHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    flexShrink: 0,
  },
  releaseTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  releaseSubtitle: {
    marginTop: 5,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12 * FONT_SCALE,
    fontStyle: 'italic',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  releaseBody: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 14,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    gap: 10,
  },
  releaseItem: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  releaseItemLast: {},
  releaseThumbWrap: {
    position: 'relative',
    flex: 1,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  releaseThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 12,
  },
  releaseThumbFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12 * FONT_SCALE,
  },
  releasePlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  releasePlayButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#0a0a12',
    fontSize: 18,
    fontWeight: 900,
  },
  releaseInfo: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 16,
  },
  releaseName: {
    margin: 0,
    color: '#ffffff',
    fontSize: 16 * FONT_SCALE,
    lineHeight: 1.15,
    fontWeight: 900,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
  },
  releaseDescription: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#f4f4f5',
    fontSize: 12 * FONT_SCALE,
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
  },
  releaseAuthor: {
    margin: 0,
    color: '#67e8f9',
    fontSize: 13 * FONT_SCALE,
    lineHeight: 1.2,
    fontWeight: 700,
  },
  releaseRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 0,
  },
  releaseVCard: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minHeight: 0,
  },
  releaseVThumbWrap: {
    position: 'relative',
    width: '100%',
    flex: 3,
    minHeight: 0,
  },
  releaseVThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  releaseVInfo: {
    flex: 2,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 0,
  },
  releaseFeaturedCard: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minHeight: 0,
  },
  releaseFeaturedThumbWrap: {
    position: 'relative',
    width: '100%',
    flex: 3,
    minHeight: 0,
  },
  releaseFeaturedInfo: {
    flex: 2,
    paddingTop: 18,
    paddingRight: 24,
    paddingBottom: 20,
    paddingLeft: 24,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  linksPage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  linksBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  linksScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  linksTopArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 34,
    alignItems: 'center',
  },
  linksKicker: {
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontSize: 14 * FONT_SCALE,
    fontWeight: 700,
    color: '#67e8f9',
    textAlign: 'center',
  },
  linksArtistName: {
    marginTop: 6,
    fontSize: 44 * FONT_SCALE,
    fontWeight: 900,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.05,
  },
  linksCard: {
    position: 'absolute',
    left: 32,
    right: 32,
    top: 148,
    bottom: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(10,10,18,0.75)',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  linkRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkIconWrap: {
    marginRight: 16,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkIconBorder: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    borderRadius: 999,
    padding: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkIcon: {
    width: 28,
    height: 28,
    objectFit: 'contain',
  },
  linkPlatformName: {
    flex: 1,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    fontSize: 12 * FONT_SCALE,
    fontWeight: 800,
  },
  linkMetricValue: {
    color: '#ffffff',
    fontSize: 13 * FONT_SCALE,
    fontWeight: 900,
    textAlign: 'right',
    flexShrink: 0,
  },
  collagePage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    flexDirection: 'column',
  },
  collageHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  collageTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  collageBody: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    gap: 10,
  },
  collageRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  collageItem: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  collageImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  horizPage: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  horizHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  horizTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  horizBody: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    gap: 12,
  },
  horizSlot: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  horizPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  contactPage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    flexDirection: 'column',
  },
  contactHeader: {
    minHeight: 130,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    paddingRight: 24,
    paddingBottom: 18,
    paddingLeft: 24,
  },
  contactTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
  },
  contactArtist: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#ffffff',
    fontSize: 26 * FONT_SCALE,
    lineHeight: 1.05,
    fontWeight: 900,
    textAlign: 'center',
  },
  contactLogo: {
    width: 320,
    height: 160,
    objectFit: 'contain',
  },
  contactFooter: {
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactBody: {
    flex: 1,
    minHeight: 0,
    paddingTop: 18,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 12,
  },
  contactCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(103,232,249,0.20)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 14,
  },
  contactLabel: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 13 * FONT_SCALE,
    fontWeight: 800,
    textAlign: 'center',
  },
  contactValue: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#ffffff',
    fontSize: 20 * FONT_SCALE,
    lineHeight: 1.15,
    fontWeight: 800,
    textAlign: 'center',
  },
});

function isHttpUrl(value) {
  return typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://'));
}

function formatReleaseDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getYoutubeThumbnailUrl(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

function getAllMilestones(artistMilestones) {
  const m = artistMilestones || {};
  return ['digital', 'live', 'press', 'collaborations']
    .flatMap((key) => (Array.isArray(m[key]) ? m[key] : []))
    .filter(Boolean)
    .slice(0, 12);
}

function chunkArray(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

// Reparto de releases por página según la cantidad total (máx 8)
const RELEASE_PAGE_SPLITS = {
  1: [1], 2: [1, 1], 3: [1, 2], 4: [2, 2],
  5: [2, 3], 6: [3, 3], 7: [4, 3], 8: [4, 4],
};

function splitReleasesIntoPages(releases) {
  const list = Array.isArray(releases) ? releases.filter((r) => r && (r.url || r.title)) : [];
  const sizes = RELEASE_PAGE_SPLITS[list.length];
  if (!sizes) return chunkArray(list, 4);
  const pages = [];
  let idx = 0;
  for (const size of sizes) {
    pages.push(list.slice(idx, idx + size));
    idx += size;
  }
  return pages;
}

function getImageSrc(url) {
  if (!isValidPdfImage(url)) return null;
  try {
    const pathname = new URL(url).pathname;
    if (url.includes('firebasestorage.googleapis.com') && !url.includes('alt=media')) {
      return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
    }
    return url;
  } catch {
    return null;
  }
}

function getImageSource(url) {
  const sanitized = getImageSrc(url);
  if (!sanitized) return null;
  if (typeof sanitized === 'string') {
    return { uri: sanitized, method: 'GET', headers: {} };
  }
  return null;
}

function truncateText(value, maxLength) {
  const text = String(value || '');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}


function hexToRgba(hex, alpha) {
  const h = (hex || '#67e8f9').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

const ICON_BASE = typeof window !== 'undefined' ? `${window.location.origin}/icons/pdf-assets/` : '/icons/pdf-assets/';

const PLATFORM_ICON_FILE = {
  instagram: 'instagram.png',
  spotify: 'spotify.png',
  facebook: 'facebook.png',
  youtube: 'youtube.png',
  tiktok: 'tiktok.png',
  appleMusic: 'applemusic.png',
};

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  spotify: 'Spotify',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  appleMusic: 'Apple Music',
  soundcloud: 'SoundCloud',
};

export default function PresskitPdfDocument({ data, variant = 'professional', colors = {}, textEffect = 'none', subtitleEffect = 'none', customFonts = {} }) {
  const cf = customFonts || {};
  if (cf.title?.url)    Font.register({ family: 'presskit-custom-title',    src: cf.title.url });
  if (cf.subtitle?.url) Font.register({ family: 'presskit-custom-subtitle', src: cf.subtitle.url });
  if (cf.body?.url)     Font.register({ family: 'presskit-custom-body',     src: cf.body.url });
  const pdfTitleFont    = cf.title?.url    ? 'presskit-custom-title'    : pdfxTheme.typography.heading.fontFamily;
  const pdfSubtitleFont = cf.subtitle?.url ? 'presskit-custom-subtitle' : pdfxTheme.typography.heading.fontFamily;
  const pdfBodyFont     = cf.body?.url     ? 'presskit-custom-body'     : pdfxTheme.typography.body.fontFamily;
  const txtFx = getPdfTextEffectStyle(textEffect);
  const subFx = getPdfTextEffectStyle(subtitleEffect);
  const c = {
    bg:       colors.bg       || '#0a0a12',
    card:     colors.card     || 'rgba(255,255,255,0.05)',
    title:    colors.title    || '#ffffff',
    subtitle: colors.subtitle || 'rgba(255,255,255,0.55)',
    text:     colors.text     || '#f4f4f5',
    accent:   colors.accent   || '#67e8f9',
    border:   colors.border   || 'rgba(255,255,255,0.12)',
    overlay:  colors.overlay  || 'rgba(0,0,0,0.36)',
  };

  const safeData = data || {};
  const isEssential = variant === 'essential';
  const safeImages = (safeData.images || []).filter(isHttpUrl);
  const coverImage = safeImages[0] || '';
  const coverApplyToPDF = Boolean(safeData.coverApplyToPDF);
  const PDF_COVER_FRAME_ASPECT = 595 / 842; // página A4 vertical
  const coverImageStyle = coverApplyToPDF
    ? coverFrameImageStyle({ ...normalizeCoverFrame(safeData), frameAspect: PDF_COVER_FRAME_ASPECT })
    : coverFrameImageStyle({ scale: 1, offsetX: 0, offsetY: 0, imageAspect: Number(safeData.coverImageAspect) || 0, frameAspect: PDF_COVER_FRAME_ASPECT });
  const performanceLiveLink = safeData.performanceLiveLink || '';
  const performanceLiveThumbnail = getYoutubeThumbnailUrl(performanceLiveLink);
  const recognitionImage = safeData.recognitionImage || '';
  const recognitionsList = Array.isArray(safeData.recognitions)
    ? safeData.recognitions.filter(Boolean)
    : (safeData.recognitions || '').split('\n').map(s => s.trim()).filter(Boolean);
  const recognitions = truncateText(
    safeData.recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección.',
    360,
  );
  const totalStreams = abbreviateMetric(safeData.totalStreams) || 'Sin dato';
  const totalVideoViews = abbreviateMetric(safeData.totalVideoViews) || 'Sin dato';
  const bio140Image = safeData.twitterBioImage || '';
  const bio140 = truncateText(safeData.twitterBio || 'Sin bio de 140 caracteres.', 190);
  const longBio = safeData.longBio || safeData.bio || 'Sin biografía completa.';
  const longBioImage = safeData.longBioImage || '';
  const releases = Array.isArray(safeData.releases) ? safeData.releases.slice(0, 8) : [];
  const releasePages = splitReleasesIntoPages(releases);
  const allMilestones = getAllMilestones(safeData.artistMilestones);
  const filledLinks = Object.entries(safeData.links || {})
    .filter(([key, value]) => key !== 'youtubeVideo' && isHttpUrl(value))
    .slice(0, 6);
  const linkScreenshots = safeData.linkScreenshots || {};
  const collageImages = safeImages.slice(1, 5);
  const pressArticles = Array.isArray(safeData.pressArticles) ? safeData.pressArticles.filter(isHttpUrl) : [];
  const contactArtistName = safeData.contactArtistName || safeData.artistName || 'Nombre del artista';
  const managerName = safeData.managerName || 'No especificado';
  const roadManagerName = safeData.roadManagerName || 'No especificado';
  const contactCountryCode = safeData.contactCountryCode || '+57';
  const contactPhone = safeData.contactPhone || 'No especificado';
  const whatsappPhone = safeData.whatsappPhone || '';
  const telHref = safeData.contactPhone ? `tel:${`${contactCountryCode}${safeData.contactPhone}`.replace(/[^\d+]/g, '')}` : '';
  const whatsappHref = whatsappPhone ? `https://wa.me/${`${contactCountryCode}${whatsappPhone}`.replace(/\D/g, '')}` : '';
  const contactLogo = safeData.contactLogo || '';
  const shortBio = safeData.shortBio || safeData.bio || 'Sin biografia corta.';
  const bioImage = safeData.bioImage || '';
  const getLinkDomain = (rawUrl) => {
    if (!rawUrl) return '';
    try {
      const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      return new URL(normalized).hostname.replace('www.', '');
    } catch {
      return rawUrl;
    }
  };

  const renderSingleReleaseFeatured = (release) => {
    const videoId = String(release?.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
    return (
      <View style={[styles.releaseBody, { gap: 0 }]}>
        <View style={{ flex: 1, flexDirection: 'column', borderRadius: 14, borderWidth: 1, borderStyle: 'solid', borderColor: c.border, backgroundColor: c.card, overflow: 'hidden' }}>
          {/* Thumbnail arriba - ocupa la mayor parte de la página */}
          <View style={{ position: 'relative', flex: 3 }}>
            {thumbnail ? (
              <>
                <Image src={getImageSource(thumbnail)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {release?.url ? (
                  <Link src={release.url} style={styles.releasePlay}>
                    <View style={{ width: '100%', height: '100%' }} />
                  </Link>
                ) : null}
              </>
            ) : (
              <View style={[styles.releaseThumbFallback, { width: '100%', height: '100%' }]}>
                <Text>Sin video</Text>
              </View>
            )}
          </View>
          {/* Texto debajo del thumbnail, centrado */}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingRight: 24, paddingBottom: 20, paddingLeft: 24 }}>
            <Text style={[styles.releaseName, { color: c.title, fontSize: 20 * FONT_SCALE, textAlign: 'center' }]}>{release?.title || 'Release sin titulo'}</Text>
            {release?.author ? <Text style={[styles.releaseAuthor, { color: c.accent, marginTop: 8, textAlign: 'center' }]}>{release.author}</Text> : null}
            {release?.description ? <Text style={[styles.releaseDescription, { color: c.text, marginTop: 8, textAlign: 'center' }]}>{truncateText(release.description, 240)}</Text> : null}
          </View>
        </View>
      </View>
    );
  };

  const renderPdfReleaseBody = (releaseChunk) => {
    if (releaseChunk.length === 1) {
      return renderSingleReleaseFeatured(releaseChunk[0]);
    }
    return (
      <View style={styles.releaseBody}>
        {releaseChunk.map((release, releaseIndex) => {
          const videoId = String(release?.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
          const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
          const isLast = releaseIndex === releaseChunk.length - 1;
          return (
            <View key={`${releaseIndex}-${release?.title || 'release'}`} style={{ ...styles.releaseItem, ...(isLast ? styles.releaseItemLast : {}), borderColor: c.border, backgroundColor: c.card }}>
              <View style={styles.releaseThumbWrap}>
                {thumbnail ? (
                  <>
                    <Image src={getImageSource(thumbnail)} style={styles.releaseThumb} />
                    {release?.url ? (
                      <Link src={release.url} style={styles.releasePlay}>
                        <View style={{ width: '100%', height: '100%' }} />
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <View style={styles.releaseThumbFallback}>
                    <Text>Sin video</Text>
                  </View>
                )}
              </View>
              <View style={styles.releaseInfo}>
                <View>
                  <Text style={[styles.releaseName, { color: c.title }]}>{release?.title || 'Release sin titulo'}</Text>
                  {release?.description ? <Text style={[styles.releaseDescription, { color: c.text }]}>{truncateText(release.description, 160)}</Text> : null}
                </View>
                {release?.author ? <Text style={[styles.releaseAuthor, { color: c.accent }]}>{release.author}</Text> : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Document>
      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.coverFrame}>
          {coverImage ? (
            <Image src={getImageSource(coverImage)} style={coverImageStyle} />
          ) : null}
          <View style={[styles.coverScrim, { backgroundColor: c.overlay }]} />
          <View style={styles.coverTop}>
            <Text style={[styles.coverArtist, { color: c.title, fontFamily: pdfTitleFont }]}>{safeData.artistName || 'Presskit sin nombre'}</Text>
          </View>
          <View style={styles.coverBottom}>
            <Text style={[styles.coverPresskit, { color: c.title }]}>PRESSKIT</Text>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.pageTwo}>
          {bioImage ? (
            <Image src={getImageSource(bioImage)} style={styles.pageTwoBackground} />
          ) : null}
          <View style={[styles.pageTwoScrim, { backgroundColor: c.overlay }]} />

          {/* Header: kicker + nombre arriba */}
          <View style={styles.pageTwoHeader}>
            <Text style={[styles.pageTwoKicker, { color: c.accent, fontFamily: pdfSubtitleFont }, subFx]}>LOGROS DE</Text>
            <Text style={[styles.pageTwoArtist, { color: c.title, fontFamily: pdfTitleFont }]}>{safeData.artistName || 'Presskit'}</Text>
          </View>

          {/* Bloque central: divider + género + bio */}
          <View style={styles.pageTwoCenter}>
            {[safeData.genre, safeData.city].filter(Boolean).length > 0 ? (
              <Text style={[styles.pageTwoInfo, { color: c.accent }, subFx]}>
                {[safeData.genre, safeData.city].filter(Boolean).join(' • ')}
              </Text>
            ) : null}
            <Text style={[styles.pageTwoBio, { color: c.text, fontFamily: pdfBodyFont }, txtFx]}>{shortBio}</Text>
          </View>

          {/* Video card anclado al fondo */}
          {performanceLiveLink ? (
            <View style={styles.pageTwoVideoWrap}>
              <View style={[styles.pageTwoVideoCard, { borderColor: c.border }]}>
                {performanceLiveThumbnail ? (
                  <Image src={getImageSource(performanceLiveThumbnail)} style={styles.pageTwoVideoThumb} />
                ) : null}
                <View style={styles.pageTwoVideoBody}>
                  <Text style={[styles.pageTwoVideoKicker, { color: c.accent }]}>LIVE PERFORMANCE</Text>
                  <Text style={[styles.pageTwoVideoTitle, { color: c.title }]}>Performance en vivo</Text>
                  <Link src={performanceLiveLink} style={[styles.pageTwoVideoLink, { color: c.accent }]}>
                    Ver video
                  </Link>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={[styles.pageThree, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.pageThreeHeader}>
          <Text style={[styles.pageThreeTitle, { color: c.accent }]}>Reconocimientos y Streams</Text>
        </View>

        <View style={styles.pageThreeBody}>
          <View style={[styles.pageThreeImageCard, { borderColor: c.border, backgroundColor: c.card }]}>
            {recognitionImage ? (
              <Image src={getImageSource(recognitionImage)} style={styles.pageThreeImage} />
            ) : (
              <View style={styles.pageThreeFallback}>
                <Text>Sin imagen de reconocimientos</Text>
              </View>
            )}
          </View>

          <View style={[styles.pageThreeCard, { borderColor: c.border, backgroundColor: c.card }]}>
            <Text style={[styles.pageThreeLabel, { color: c.subtitle }]}>Reconocimientos</Text>
            <View style={{ marginTop: 10, gap: 5 }}>
              {recognitionsList.length > 0 ? recognitionsList.map((r, i) => (
                <Text key={i} style={[styles.pageThreeText, { color: c.text, marginTop: 0 }]}>{r}</Text>
              )) : (
                <Text style={[styles.pageThreeText, { color: c.subtitle, marginTop: 0 }]}>
                  Añade reconocimientos para completar esta sección.
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.pageThreeFooter}>
          <View style={[styles.pageThreeMetric, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: hexToRgba(c.accent, 0.08) }]}>
            <Text style={[styles.pageThreeMetricLabel, { color: c.accent }]}>Total streams</Text>
            <Text style={[styles.pageThreeMetricValue, { color: c.title }]}>{totalStreams}</Text>
          </View>
          <View style={[styles.pageThreeMetric, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: hexToRgba(c.accent, 0.08) }]}>
            <Text style={[styles.pageThreeMetricLabel, { color: c.accent }]}>Total video{'\n'}views</Text>
            <Text style={[styles.pageThreeMetricValue, { color: c.title }]}>{totalVideoViews}</Text>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.pageFour}>
          <View style={styles.pageFourHeader}>
            <Text style={[styles.pageFourTitle, { color: c.accent }]}>Biografía</Text>
          </View>

          <View style={styles.pageFourBioSection}>
            <Text style={[styles.pageFourBioText, { color: c.text }]}>{bio140}</Text>
          </View>

          <View style={styles.pageFourImageSection}>
            {bio140Image ? (
              <Image src={getImageSource(bio140Image)} style={styles.pageFourImage} />
            ) : (
              <View style={styles.pageFourFallback}>
                <Text>Sin imagen de bio de 140 caracteres</Text>
              </View>
            )}
            <View style={[styles.pageFourScrim, { backgroundColor: c.overlay }]} />

            <View style={styles.pageFourMilestoneOverlay}>
              {(() => {
                const count = allMilestones.length;
                // Menos hitos => texto más grande; solo con los 12 completos baja al mínimo.
                const fontSize = (count <= 4 ? 17 : count <= 6 ? 15 : count <= 8 ? 13 : count <= 10 ? 12 : 10) * FONT_SCALE;
                const paddingV = count <= 4 ? 14 : count <= 6 ? 11 : count <= 8 ? 8 : count <= 10 ? 6 : 5;
                const paddingH = count <= 4 ? 22 : count <= 8 ? 16 : 11;
                return allMilestones.map((item, i) => (
                  <View key={i} style={[styles.pageFourMilestoneItem, { paddingTop: paddingV, paddingBottom: paddingV, paddingLeft: paddingH, paddingRight: paddingH, borderColor: hexToRgba(c.accent, 0.28), backgroundColor: hexToRgba(c.bg, 0.72) }]}>
                    <Text style={[styles.pageFourMilestoneText, { fontSize, color: c.text }]}>{item}</Text>
                  </View>
                ));
              })()}
            </View>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.pageFive}>
          {longBioImage ? (
            <Image src={getImageSource(longBioImage)} style={styles.pageFiveBackground} />
          ) : null}
          <View style={[styles.pageFiveScrim, { backgroundColor: c.overlay }]} />
          <View style={styles.pageFiveHeader}>
            <Text style={[styles.pageFiveTitle, { color: c.accent }]}>BIOGRAFÍA DE PRENSA</Text>
          </View>
          <View style={styles.pageFiveTextPanel}>
            {safeData.artistName ? <Text style={[styles.pageFiveArtistSub, { color: c.title, fontFamily: pdfTitleFont }]}>{safeData.artistName}</Text> : null}
            <Text style={[styles.pageFiveText, { color: c.text, fontFamily: pdfBodyFont }, txtFx]}>{longBio}</Text>
          </View>
        </View>
      </Page>

      {releasePages.map((releaseChunk, pageIndex) => (
        <Page key={`release-page-${pageIndex}`} size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
          <View style={styles.releasePage}>
          <View style={styles.releaseHeader}>
            <Text style={[styles.releaseTitle, { color: c.accent }]}>
              Video Releases {releasePages.length > 1 ? `(${pageIndex + 1}/${releasePages.length})` : ''}
            </Text>
            {pageIndex === 0 && safeData.releasesCtaText ? (
              <Text style={[styles.releaseSubtitle, { color: c.subtitle }]}>{safeData.releasesCtaText}</Text>
            ) : null}
          </View>

          {renderPdfReleaseBody(releaseChunk)}
          </View>
        </Page>
      ))}

      {filledLinks.length > 0 ? (
        <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
          <View style={styles.linksPage}>
            {(safeImages[1] || coverImage) ? (
              <Image src={getImageSource(safeImages[1] || coverImage)} style={styles.linksBackground} />
            ) : null}
            <View style={[styles.linksScrim, { backgroundColor: c.overlay }]} />

            <View style={styles.linksTopArea}>
              <Text style={[styles.linksKicker, { color: c.subtitle, fontFamily: pdfSubtitleFont }, subFx]}>CONECTA CON</Text>
              <Text style={[styles.linksArtistName, { color: c.title, fontFamily: pdfTitleFont }]}>{safeData.artistName || ''}</Text>
            </View>

            <View style={[styles.linksCard, { borderColor: c.border, backgroundColor: hexToRgba(c.bg, 0.75) }]}>
              {filledLinks.map(([key, value], index) => {
                const isLast = index === filledLinks.length - 1;
                const iconFile = PLATFORM_ICON_FILE[key];
                const iconUrl = iconFile ? `${ICON_BASE}${iconFile}` : null;
                const label = PLATFORM_LABELS[key] || String(key).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (ch) => ch.toUpperCase());
                const metric = (safeData.linkMetrics || {})[key] || '';
                return (
                  <Link key={`link-${key}-${index}`} src={value} style={[styles.linkRow, isLast ? styles.linkRowLast : {}]}>
                    <View style={styles.linkIconWrap}>
                      <View style={styles.linkIconBorder}>
                        {iconUrl ? (
                          <Image src={{ uri: iconUrl, method: 'GET', headers: {} }} style={styles.linkIcon} />
                        ) : (
                          <Text style={{ color: '#ffffff', fontSize: 9 * FONT_SCALE, fontWeight: 800 }}>{label.slice(0, 2).toUpperCase()}</Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.linkPlatformName, { color: c.title }]}>{label}</Text>
                    {metric ? <Text style={[styles.linkMetricValue, { color: c.title }]}>{metric}</Text> : null}
                  </Link>
                );
              })}
            </View>
          </View>
        </Page>
      ) : null}

      {collageImages.length > 0 ? (
        <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
          <View style={[styles.collagePage, { backgroundColor: c.bg }]}>
            <View style={styles.collageHeader}>
              <Text style={[styles.collageTitle, { color: c.accent }]}>Galería visual</Text>
            </View>

            <View style={styles.collageBody}>
              <View style={styles.collageRow}>
                {collageImages.slice(0, 2).map((image, i) => (
                  <View key={`top-${i}`} style={styles.collageItem}>
                    <Image src={getImageSource(image)} style={styles.collageImage} />
                  </View>
                ))}
              </View>
              <View style={styles.collageRow}>
                {collageImages.slice(2, 4).map((image, i) => (
                  <View key={`bot-${i}`} style={styles.collageItem}>
                    <Image src={getImageSource(image)} style={styles.collageImage} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Page>
      ) : null}

      {(safeImages[5] || safeImages[6]) ? (
        <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
          <View style={styles.horizPage}>
            <View style={styles.horizHeader}>
              <Text style={[styles.horizTitle, { color: c.accent }]}>Galería</Text>
            </View>
            <View style={styles.horizBody}>
              {safeImages[5] ? (
                <View style={styles.horizSlot}>
                  <Image src={getImageSource(safeImages[5])} style={styles.horizPhoto} />
                </View>
              ) : null}
              {safeImages[6] ? (
                <View style={styles.horizSlot}>
                  <Image src={getImageSource(safeImages[6])} style={styles.horizPhoto} />
                </View>
              ) : null}
            </View>
          </View>
        </Page>
      ) : null}

      {pressArticles.map((article, index) => (
        <Page key={`press-article-${index}`} size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: '#ffffff' }]} wrap={false}>
          <View style={{ width: '100%', height: '100%', padding: 20 }}>
            {article ? (
              <Image src={getImageSource(article)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#999999', fontSize: 12 }}>Sin imagen de artículo de prensa</Text>
              </View>
            )}
          </View>
        </Page>
      ))}

      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={[styles.contactPage, { backgroundColor: c.bg }]}>
          <View style={styles.contactHeader}>
            <Text style={[styles.contactTitle, { color: c.accent }]}>Contacto</Text>
            <Text style={[styles.contactArtist, { color: c.title }]}>{contactArtistName}</Text>
          </View>

          <View style={styles.contactBody}>
            <View style={[styles.contactCard, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: c.card }]}>
              <Text style={[styles.contactLabel, { color: c.accent }]}>Manager</Text>
              <Text style={[styles.contactValue, { color: c.title }]}>{managerName}</Text>
            </View>

            <View style={[styles.contactCard, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: c.card }]}>
              <Text style={[styles.contactLabel, { color: c.accent }]}>Road Manager</Text>
              <Text style={[styles.contactValue, { color: c.title }]}>{roadManagerName}</Text>
            </View>

            <View style={[styles.contactCard, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: c.card }]}>
              <Text style={[styles.contactLabel, { color: c.accent }]}>Contacto</Text>
              {telHref ? (
                <Link src={telHref} style={[styles.contactValue, { color: c.title, textDecoration: 'none' }]}>{contactCountryCode} {contactPhone}</Link>
              ) : (
                <Text style={[styles.contactValue, { color: c.title }]}>{contactCountryCode} {contactPhone}</Text>
              )}
            </View>

            {whatsappPhone ? (
              <View style={[styles.contactCard, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: c.card }]}>
                <Text style={[styles.contactLabel, { color: c.accent }]}>WhatsApp</Text>
                <Link src={whatsappHref} style={[styles.contactValue, { color: c.title, textDecoration: 'none' }]}>{contactCountryCode} {whatsappPhone}</Link>
              </View>
            ) : null}

            <View style={[styles.contactCard, { borderColor: hexToRgba(c.accent, 0.25), backgroundColor: c.card }]}>
              <Text style={[styles.contactLabel, { color: c.accent }]}>Artista</Text>
              <Text style={[styles.contactValue, { color: c.title }]}>{safeData.artistName || 'Nombre del artista'}</Text>
            </View>
          </View>

          {contactLogo ? (
            <View style={styles.contactFooter}>
              <Image src={getImageSource(contactLogo)} style={styles.contactLogo} />
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
