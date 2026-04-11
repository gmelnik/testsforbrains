namespace Infrastructure.Processes
{
    using System;
    using System.Linq.Expressions;

    // TODO: Does this even belong to a reusable infrastructure?
    // This for reading and writing processes (aka Sagas in the CQRS community)
    public interface IProcessDataContext<T> : IDisposable
        where T : class, IProcess
    {
        T Find(Guid id);

        void Save(T process);

        // TODO: queryability to reload processes from correlation ids, etc. 
        // Is this appropriate? How do others reload processes? (MassTransit 
        // uses this kind of queryable thinghy, apparently).
        //IEnumerable<T> Query(Expression<Func<T, bool>> predicate)
        T Find(Expression<Func<T, bool>> predicate);
    }
}
