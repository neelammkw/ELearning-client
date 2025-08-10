import { apiSlice } from "../api/apiSlice";
interface FaqItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
}

interface BannerImage {
  public_id: string;
  url: string;
}

interface Layout {
  type: string;
  faq: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
    description: string;
  };
}

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query<{ layout: Layout }, string>({
      query: (type) => ({
        url: `get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
      transformResponse: (response: { success: boolean; layout: Layout }) => ({
        layout: response.layout,
      }),
      providesTags: ["Layout"],
    }),

    createLayout: builder.mutation({
      query: ({ type, faq, categories, banner }) => ({
        url: "create-layout",
        method: "POST",
        body: {
          type,
          faq,
          categories,
          banner,
        },
        credentials: "include" as const,
      }),
    }),

    getLayout: builder.query({
      query: (type) => ({
        url: `get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    editLayout: builder.mutation({
      query: ({ type, faq, categories, banner }) => ({
        url: "edit-layout",
        method: "PUT",
        body: {
          type,
          faq,
          categories,
          banner,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetHeroDataQuery,
  useGetLayoutQuery,
  useEditLayoutMutation,
  useCreateLayoutMutation,
} = layoutApi;
