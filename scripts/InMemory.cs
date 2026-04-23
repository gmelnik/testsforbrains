namespace Infrastructure.Messaging.InMemory
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Infrastructure.Messaging.Handling;

    /// <summary>
    /// Sample in-memory command bus that is asynchronous.
    /// </summary>
    public class MemoryCommandBus : ICommandBus, ICommandHandlerRegistry
    {
        private List<ICommandHandler> handlers = new List<ICommandHandler>();
        private List<Envelope<ICommand>> commands = new List<Envelope<ICommand>>();

        public MemoryCommandBus(params ICommandHandler[] handlers)
        {
            this.handlers.AddRange(handlers);
        }

        public void Register(ICommandHandler handler)
        {
            this.handlers.Add(handler);
        }

        public void Send(Envelope<ICommand> command)
        {
            this.commands.Add(command);

            Task.Factory.StartNew(() =>
            {
                if (command.Delay > TimeSpan.Zero)
                {
                    Thread.Sleep(command.Delay);
                }

                var handlerType = typeof(ICommandHandler<>).MakeGenericType(command.Body.GetType());

                foreach (dynamic handler in this.handlers
                    .Where(x => handlerType.IsAssignableFrom(x.GetType())))
                {
                    handler.Handle((dynamic)command.Body);
                }
            });
        }

        public void Send(IEnumerable<Envelope<ICommand>> commands)
        {
            foreach (var command in commands)
            {
                this.Send(command);
            }
        }

        public IEnumerable<Envelope<ICommand>> Commands
        {
            get { return this.commands; }
        }
    }
}
