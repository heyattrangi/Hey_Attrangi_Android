import { IAuthService } from './auth/IAuthService';
import { mockAuthService } from './auth/MockAuthService';
import { realAuthService } from './auth/RealAuthService';
import { IBookingService } from './booking/IBookingService';
import { mockBookingService } from './booking/MockBookingService';
import { realBookingService } from './booking/RealBookingService';
import { IChatService } from './chat/IChatService';
import { mockChatService } from './chat/MockChatService';
import { realChatService } from './chat/RealChatService';
import { IMoodService } from './mood/IMoodService';
import { mockMoodService } from './mood/MockMoodService';
import { realMoodService } from './mood/RealMoodService';
import { INotificationService } from './notifications/INotificationService';
import { mockNotificationService } from './notifications/MockNotificationService';
import { realNotificationService } from './notifications/RealNotificationService';
import { IPaymentService } from './payment/IPaymentService';
import { mockPaymentService } from './payment/MockPaymentService';
import { realPaymentService } from './payment/RealPaymentService';
import { IProfileService } from './profile/IProfileService';
import { mockProfileService } from './profile/MockProfileService';
import { realProfileService } from './profile/RealProfileService';
import { ISessionService } from './sessions/ISessionService';
import { mockSessionService } from './sessions/MockSessionService';
import { realSessionService } from './sessions/RealSessionService';
import { ITherapistService } from './therapists/ITherapistService';
import { mockTherapistService } from './therapists/MockTherapistService';
import { realTherapistService } from './therapists/RealTherapistService';
import { IJournalService } from './journal/IJournalService';
import { mockJournalService } from './journal/MockJournalService';
import { realJournalService } from './journal/RealJournalService';
import { IWellnessService } from './wellness/IWellnessService';
import { mockWellnessService } from './wellness/MockWellnessService';
import { realWellnessService } from './wellness/RealWellnessService';
import { IBillingService } from './billing/IBillingService';
import { mockBillingService } from './billing/MockBillingService';
import { realBillingService } from './billing/RealBillingService';
import { IVideoSessionService } from './video/IVideoSessionService';
import { mockVideoSessionService } from './video/MockVideoSessionService';
import { realVideoSessionService } from './video/RealVideoSessionService';
import { ISearchService } from './search/ISearchService';
import { mockSearchService } from './search/MockSearchService';
import { realSearchService } from './search/RealSearchService';
import { IPersonalizationService } from './personalization/IPersonalizationService';
import { mockPersonalizationService } from './personalization/MockPersonalizationService';
import { realPersonalizationService } from './personalization/RealPersonalizationService';
import { IEngagementService } from './engagement/IEngagementService';
import { mockEngagementService } from './engagement/MockEngagementService';
import { realEngagementService } from './engagement/RealEngagementService';
import { IInstitutionService } from './institution/IInstitutionService';
import { mockInstitutionService } from './institution/MockInstitutionService';
import { realInstitutionService } from './institution/RealInstitutionService';
import { IReportsService } from './reports/IReportsService';
import { mockReportsService } from './reports/MockReportsService';
import { realReportsService } from './reports/RealReportsService';
import { IFamilyService } from './family/IFamilyService';
import { mockFamilyService } from './family/MockFamilyService';
import { realFamilyService } from './family/RealFamilyService';
import { ICommunityService } from './community/ICommunityService';
import { mockCommunityService } from './community/MockCommunityService';
import { realCommunityService } from './community/RealCommunityService';
import { IPortalService } from './portal/IPortalService';
import { mockPortalService } from './portal/MockPortalService';
import { realPortalService } from './portal/RealPortalService';
import { IDevToolsService } from './devtools/IDevToolsService';
import { mockDevToolsService } from './devtools/MockDevToolsService';
import { realDevToolsService } from './devtools/RealDevToolsService';
import {
  getEffectiveUseMockNonAuth,
  getEffectiveUseMockServices,
} from '../config/devRuntime';

/**
 * DI container — stores call `get*Service()` only.
 *
 * ## Mock → Real swap (minimal changes)
 * 1. Set `env.USE_MOCK_SERVICES = false` (and optionally `USE_MOCK_NON_AUTH_MODULES`)
 * 2. Set `env.API_BASE_URL` to your API host (not `mock://local`)
 * 3. No store / screen changes required
 *
 * Layers: Store → I*Service (Mock|Real) → Repository → HttpClient (MockAdapter|Fetch)
 */
export const shouldUseMockServices = (): boolean => getEffectiveUseMockServices();

export const shouldUseMockNonAuth = (): boolean => getEffectiveUseMockNonAuth();

function pickAuth(): IAuthService {
  return shouldUseMockServices() ? mockAuthService : realAuthService;
}

function pickNonAuth<T>(mock: T, real: T): T {
  return shouldUseMockNonAuth() ? mock : real;
}

export const services = {
  get auth(): IAuthService {
    return pickAuth();
  },
  get profile(): IProfileService {
    return pickNonAuth(mockProfileService, realProfileService);
  },
  get therapists(): ITherapistService {
    return pickNonAuth(mockTherapistService, realTherapistService);
  },
  get booking(): IBookingService {
    return pickNonAuth(mockBookingService, realBookingService);
  },
  get sessions(): ISessionService {
    return pickNonAuth(mockSessionService, realSessionService);
  },
  get chat(): IChatService {
    return pickNonAuth(mockChatService, realChatService);
  },
  get mood(): IMoodService {
    return pickNonAuth(mockMoodService, realMoodService);
  },
  get notifications(): INotificationService {
    return pickNonAuth(mockNotificationService, realNotificationService);
  },
  get payment(): IPaymentService {
    return pickNonAuth(mockPaymentService, realPaymentService);
  },
  get journal(): IJournalService {
    return pickNonAuth(mockJournalService, realJournalService);
  },
  get wellness(): IWellnessService {
    return pickNonAuth(mockWellnessService, realWellnessService);
  },
  get billing(): IBillingService {
    return pickNonAuth(mockBillingService, realBillingService);
  },
  get videoSession(): IVideoSessionService {
    return pickNonAuth(mockVideoSessionService, realVideoSessionService);
  },
  get search(): ISearchService {
    return pickNonAuth(mockSearchService, realSearchService);
  },
  get personalization(): IPersonalizationService {
    return pickNonAuth(mockPersonalizationService, realPersonalizationService);
  },
  get engagement(): IEngagementService {
    return pickNonAuth(mockEngagementService, realEngagementService);
  },
  get institution(): IInstitutionService {
    return pickNonAuth(mockInstitutionService, realInstitutionService);
  },
  get reports(): IReportsService {
    return pickNonAuth(mockReportsService, realReportsService);
  },
  get family(): IFamilyService {
    return pickNonAuth(mockFamilyService, realFamilyService);
  },
  get community(): ICommunityService {
    return pickNonAuth(mockCommunityService, realCommunityService);
  },
  get portal(): IPortalService {
    return pickNonAuth(mockPortalService, realPortalService);
  },
  get devTools(): IDevToolsService {
    return pickNonAuth(mockDevToolsService, realDevToolsService);
  },
};

export const getAuthService = (): IAuthService => services.auth;
export const getProfileService = (): IProfileService => services.profile;
export const getTherapistService = (): ITherapistService => services.therapists;
export const getBookingService = (): IBookingService => services.booking;
export const getSessionService = (): ISessionService => services.sessions;
export const getChatService = (): IChatService => services.chat;
export const getMoodService = (): IMoodService => services.mood;
export const getNotificationService = (): INotificationService =>
  services.notifications;
export const getPaymentService = (): IPaymentService => services.payment;
export const getJournalService = (): IJournalService => services.journal;
export const getWellnessService = (): IWellnessService => services.wellness;
export const getBillingService = (): IBillingService => services.billing;
export const getVideoSessionService = (): IVideoSessionService =>
  services.videoSession;
export const getSearchService = (): ISearchService => services.search;
export const getPersonalizationService = (): IPersonalizationService =>
  services.personalization;
export const getEngagementService = (): IEngagementService =>
  services.engagement;
export const getInstitutionService = (): IInstitutionService =>
  services.institution;
export const getReportsService = (): IReportsService => services.reports;
export const getFamilyService = (): IFamilyService => services.family;
export const getCommunityService = (): ICommunityService => services.community;
export const getPortalService = (): IPortalService => services.portal;
export const getDevToolsService = (): IDevToolsService => services.devTools;
