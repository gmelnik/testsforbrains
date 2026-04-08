namespace Infrastructure.EventSourcing
{
    using System;
    using System.Collections.Generic;

    public interface IEventSourced
    {
        Guid Id { get; }

        int Version { get; }

        IEnumerable<IVersionedEvent> Events { get; }
    }
}
