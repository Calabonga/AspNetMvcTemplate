using System.Collections.Generic;
using AspNetMvcTemplate.Models;
using AspNetMvcTemplate.Web.Infrastructure.Dto;
using Calabonga.EntityFramework;
using Calabonga.PagedListLite;
using ExpressMapper;
using ExpressMapper.Extensions;

namespace AspNetMvcTemplate.Web.Infrastructure.EntityMapper
{
    /// <summary>
    /// Wrapper for Mapper
    /// </summary>
    public class EntityFrameworkMapper : IEntityFrameworkMapper
    {
        private readonly IMappingServiceProvider _mapper;

        #region constructor

        public EntityFrameworkMapper(IMappingServiceProvider mapper)
        {
            _mapper = mapper;
        }

        #endregion

        /// <summary>
        /// Returns mapped entity
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestionation"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public TDestionation Map<TSource, TDestionation>(TSource source)
        {
            return _mapper.Map<TSource, TDestionation>(source);
        }

        /// <summary>
        /// Returns mapped entity
        /// </summary>
        /// <typeparam name="TDestionation"></typeparam>
        /// <typeparam name="TSource"></typeparam>
        /// <param name="model"></param>
        /// <param name="item"></param>
        public void Map<TDestionation, TSource>(TDestionation model, TSource item)
            where TDestionation : class, IEntityId where TSource : class, IEntityId
        {
            _mapper.Map(typeof(TDestionation), typeof(TSource), model, item);
        }

        /// <summary>
        /// Register map in current mapper instance
        /// This operation should be executed once
        /// </summary>
        public void RegisterMaps()
        {
            #region MessageLog

            _mapper.Register<MessageLog, MessageLogDto>();
            _mapper.RegisterCustom<PagedList<MessageLog>, PagedList<MessageLogDto>, LogItemPagedListMapper>();

            #endregion
        }

        public void Reset()
        {
            _mapper.Reset();
        }
    }

    #region MessageLog -> MessageLogDto PagedLIst CustomTypeResolver

    /// <summary>
    /// PagedList Mapper for MessageLog
    /// </summary>
    public class LogItemPagedListMapper : ICustomTypeMapper<PagedList<MessageLog>, PagedList<MessageLogDto>>
    {
        public PagedList<MessageLogDto> Map(IMappingContext<PagedList<MessageLog>, PagedList<MessageLogDto>> context)
        {
            var items = context.Source.Items.Map<ICollection<MessageLog>, ICollection<MessageLogDto>>();
            return new PagedList<MessageLogDto>(items, context.Source.PageIndex, context.Source.PageSize, context.Source.TotalCount);
        }
    }

    #endregion
}
