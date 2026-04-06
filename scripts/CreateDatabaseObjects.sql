/****** Object:  Schema [SqlBus]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [SqlBus] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [Events]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [Events] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [ConferenceRegistrationProcesses]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [ConferenceRegistrationProcesses] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [ConferenceRegistration]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [ConferenceRegistration] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [ConferencePayments]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [ConferencePayments] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [ConferenceManagement]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [ConferenceManagement] AUTHORIZATION [dbo]
GO
/****** Object:  Schema [BlobStorage]    Script Date: 05/01/2012 12:58:28 ******/
CREATE SCHEMA [BlobStorage] AUTHORIZATION [dbo]
GO
/****** Object:  Table [ConferenceManagement].[Conferences]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceManagement].[Conferences](
	[Id] [uniqueidentifier] NOT NULL,
	[AccessCode] [nvarchar](6) NULL,
	[OwnerName] [nvarchar](max) NOT NULL,
	[OwnerEmail] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[Slug] [nvarchar](max) NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NOT NULL,
	[IsPublished] [bit] NOT NULL,
	[WasEverPublished] [bit] NOT NULL,
 CONSTRAINT [PK_ConferenceManagement.Conferences] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [SqlBus].[Commands]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [SqlBus].[Commands](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[DeliveryDate] [datetime] NULL,
 CONSTRAINT [PK_SqlBus.Commands] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [BlobStorage].[Blobs]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [BlobStorage].[Blobs](
	[Id] [nvarchar](128) NOT NULL,
	[ContentType] [nvarchar](max) NULL,
	[Blob] [varbinary](max) NULL,
	[BlobString] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [SqlBus].[Events]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [SqlBus].[Events](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[DeliveryDate] [datetime] NULL,
 CONSTRAINT [PK_SqlBus.Events] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [Events].[Events]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Events].[Events](
	[AggregateId] [uniqueidentifier] NOT NULL,
	[AggregateType] [nvarchar](128) NOT NULL,
	[Version] [int] NOT NULL,
	[Payload] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[AggregateId] ASC,
	[AggregateType] ASC,
	[Version] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferenceRegistration].[ConferencesView]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceRegistration].[ConferencesView](
	[Id] [uniqueidentifier] NOT NULL,
	[Code] [nvarchar](max) NULL,
	[Name] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[StartDate] [datetimeoffset](7) NOT NULL,
	[IsPublished] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferenceRegistrationProcesses].[RegistrationProcess]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceRegistrationProcesses].[RegistrationProcess](
	[Id] [uniqueidentifier] NOT NULL,
	[Completed] [bit] NOT NULL,
	[ConferenceId] [uniqueidentifier] NOT NULL,
	[OrderId] [uniqueidentifier] NOT NULL,
	[ReservationId] [uniqueidentifier] NOT NULL,
	[ReservationAutoExpiration] [datetime] NULL,
	[ExpirationCommandId] [uniqueidentifier] NOT NULL,
	[StateValue] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferenceRegistration].[OrdersView]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceRegistration].[OrdersView](
	[OrderId] [uniqueidentifier] NOT NULL,
	[ReservationExpirationDate] [datetime] NULL,
	[StateValue] [int] NOT NULL,
	[RegistrantEmail] [nvarchar](max) NULL,
	[AccessCode] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferencePayments].[ThirdPartyProcessorPayments]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferencePayments].[ThirdPartyProcessorPayments](
	[Id] [uniqueidentifier] NOT NULL,
	[StateValue] [int] NOT NULL,
	[PaymentSourceId] [uniqueidentifier] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[TotalAmount] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  View [ConferencePayments].[ThirdPartyProcessorPaymentDetailsView]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [ConferencePayments].[ThirdPartyProcessorPaymentDetailsView]
AS
SELECT     
    Id AS Id, 
    StateValue as StateValue,
    PaymentSourceId as PaymentSourceId,
    Description as Description,
    TotalAmount as TotalAmount
FROM ConferencePayments.ThirdPartyProcessorPayments
GO
/****** Object:  Table [ConferencePayments].[ThidPartyProcessorPaymentItems]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferencePayments].[ThidPartyProcessorPaymentItems](
	[Id] [uniqueidentifier] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[ThirdPartyProcessorPayment_Id] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferenceManagement].[SeatTypes]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceManagement].[SeatTypes](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[ConferenceInfo_Id] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_ConferenceManagement.SeatTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
CREATE NONCLUSTERED INDEX [IX_ConferenceInfo_Id] ON [ConferenceManagement].[SeatTypes] 
(
	[ConferenceInfo_Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF)
GO
/****** Object:  Table [ConferenceRegistration].[OrderItemsView]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceRegistration].[OrderItemsView](
	[Id] [uniqueidentifier] NOT NULL,
	[SeatType] [uniqueidentifier] NOT NULL,
	[SeatTypeDescription] [nvarchar](max) NULL,
	[RequestedSeats] [int] NOT NULL,
	[ReservedSeats] [int] NOT NULL,
	[OrderDTO_OrderId] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [ConferenceRegistration].[ConferenceSeatsView]    Script Date: 05/01/2012 12:58:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [ConferenceRegistration].[ConferenceSeatsView](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[Quantity] [int] NOT NULL,
	[ConferencesView_Id] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  ForeignKey [ThirdPartyProcessorPayment_Items]    Script Date: 05/01/2012 12:58:29 ******/
ALTER TABLE [ConferencePayments].[ThidPartyProcessorPaymentItems]  WITH CHECK ADD  CONSTRAINT [ThirdPartyProcessorPayment_Items] FOREIGN KEY([ThirdPartyProcessorPayment_Id])
REFERENCES [ConferencePayments].[ThirdPartyProcessorPayments] ([Id])
GO
ALTER TABLE [ConferencePayments].[ThidPartyProcessorPaymentItems] CHECK CONSTRAINT [ThirdPartyProcessorPayment_Items]
GO
/****** Object:  ForeignKey [FK_ConferenceManagement.SeatTypes_ConferenceManagement.Conferences_ConferenceInfo_Id]    Script Date: 05/01/2012 12:58:29 ******/
ALTER TABLE [ConferenceManagement].[SeatTypes]  WITH CHECK ADD  CONSTRAINT [FK_ConferenceManagement.SeatTypes_ConferenceManagement.Conferences_ConferenceInfo_Id] FOREIGN KEY([ConferenceInfo_Id])
REFERENCES [ConferenceManagement].[Conferences] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [ConferenceManagement].[SeatTypes] CHECK CONSTRAINT [FK_ConferenceManagement.SeatTypes_ConferenceManagement.Conferences_ConferenceInfo_Id]
GO
/****** Object:  ForeignKey [OrderDTO_Lines]    Script Date: 05/01/2012 12:58:29 ******/
ALTER TABLE [ConferenceRegistration].[OrderItemsView]  WITH CHECK ADD  CONSTRAINT [OrderDTO_Lines] FOREIGN KEY([OrderDTO_OrderId])
REFERENCES [ConferenceRegistration].[OrdersView] ([OrderId])
GO
ALTER TABLE [ConferenceRegistration].[OrderItemsView] CHECK CONSTRAINT [OrderDTO_Lines]
GO
/****** Object:  ForeignKey [ConferenceDTO_Seats]    Script Date: 05/01/2012 12:58:29 ******/
ALTER TABLE [ConferenceRegistration].[ConferenceSeatsView]  WITH CHECK ADD  CONSTRAINT [ConferenceDTO_Seats] FOREIGN KEY([ConferencesView_Id])
REFERENCES [ConferenceRegistration].[ConferencesView] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [ConferenceRegistration].[ConferenceSeatsView] CHECK CONSTRAINT [ConferenceDTO_Seats]
GO
