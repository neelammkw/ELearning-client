import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      {
        clientSecret: string;
        orderId: string;
      },
      { courseId: string }
    >({
      query: (data) => ({
        url: "create-payment-intent",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    confirmOrder: builder.mutation<
      { success: boolean },
      {
        paymentIntentId: string;
        orderId: string;
      }
    >({
      query: (data) => ({
        url: "confirm-order",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getAllOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "get-orders",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => {
        // First check if result exists and is an array
        if (Array.isArray(result)) {
          return [
            ...result.map(({ _id }) => ({ type: "Orders" as const, id: _id })),
            "Orders",
          ];
        }
        // Fallback if result is not an array
        return ["Orders"];
      },
    }),
    getUserOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "get-user-orders",
        method: "GET",
        credentials: "include" as const,
      }),
      transformResponse: (response: {
        success: boolean;
        orders?: IOrder[];
      }) => {
        if (response.success && response.orders) {
          return response.orders;
        }
        return [];
      },
      providesTags: (result) => {
        if (result && Array.isArray(result)) {
          return [
            ...result.map(({ _id }) => ({
              type: "UserOrders" as const,
              id: _id,
            })),
            { type: "UserOrders", id: "LIST" },
          ];
        }
        return [{ type: "UserOrders", id: "LIST" }];
      },
    }),
    getOrderById: builder.query<{ order: IOrder }, string>({
      query: (id) => ({
        url: `get-order/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    updateOrderStatus: builder.mutation<IOrder, { id: string; status: string }>(
      {
        query: ({ id, status }) => ({
          url: `update-order-status/${id}`,
          method: "PUT",
          body: { status },
          credentials: "include" as const,
        }),
        async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            orderApi.util.updateQueryData("getOrderById", id, (draft) => {
              if (draft) draft.order.payment_info.status = status;
            }),
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
        invalidatesTags: ["Orders", "UserOrders"],
      },
    ),

    deleteOrder: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `delete-order/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
        { type: "UserOrders", id: "LIST" },
      ],
    }),

    getOrderAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => ({
        url: "get-order-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Analytics"],
    }),

    getStripePublishableKey: builder.query<{ publishableKey: string }, void>({
      query: () => ({
        url: "payment/stripepublishablekey",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmOrderMutation,
  useGetAllOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetOrderAnalyticsQuery,
  useGetStripePublishableKeyQuery,
} = orderApi;
