using System;
using System.Linq;
using System.Linq.Expressions;
using AspNetMvcTemplate.Data.Base;
using AspNetMvcTemplate.Models;
using AspNetMvcTemplate.Web.Infrastructure.QueryParams;
using AspNetMvcTemplate.Web.Infrastructure.Services;
using Calabonga.EntityFramework;
using Calabonga.OperationResults;

namespace AspNetMvcTemplate.Web.Infrastructure.Repositories
{

    /// <summary>
    /// LogItem readonly repository
    /// </summary>
    public class MessageLogRepository : ReadableRepositoryBase<MessageLog, MessageLogPagedListQueryParams>
    {

        public MessageLogRepository(IApplicationDbContext context, ILogService logger, IEntityFrameworkMapper mapper)
            : base(context, logger, mapper)
        {
        }

        public override IQueryable<MessageLog> FilterData(MessageLogPagedListQueryParams queryParams, params Expression<Func<MessageLog, object>>[] includeProperties)
        {
            var all = All(includeProperties);
            if (!string.IsNullOrWhiteSpace(queryParams.Level))
            {
                all = all.Where(x => x.Level.ToLower().Equals(queryParams.Level.ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryParams.Search))
            {
                var term = queryParams.Search.ToLower();
                all = all.Where(x => x.Message.ToLower().Contains(term)
                    || x.Exception.ToLower().Contains(term)
                    || x.Context.ToString().ToLower().Contains(term));
            }

            return all;
        }

        /// <summary>
        /// Special method for clearing log table
        /// </summary>
        /// <returns></returns>
        public OperationResult<bool> ClearLogsOperationResult()
        {
            var operationResult = OperationResult.CreateResult<bool>();
            try
            {
                AppContext.Database.ExecuteSqlCommand("DELETE FROM MessageLogs");
                operationResult.Result = true;
                var message = "Event log cleaned";
                operationResult.AddSuccess(message);
                LogService.LogInfo(message);
                return operationResult;
            }
            catch (Exception exception)
            {
                operationResult.Result = false;
                operationResult.AddError("Cannot clean event log.");
                operationResult.Error = exception;
                return operationResult;
            }
        }
    }
}
